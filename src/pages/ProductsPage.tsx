import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  name_bn: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  sizes: string[] | null;
  buy_link: string | null;
}

const emptyForm = {
  name: "", name_bn: "", category: "", price: "0", image_url: "", sizes: "", buy_link: "",
};

export default function ProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandId, setBrandId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: brands } = await supabase.from("brands").select("id").eq("user_id", user.id).limit(1);
      const bid = brands?.[0]?.id;
      if (!bid) { setLoading(false); return; }
      setBrandId(bid);
      const { data } = await supabase.from("products").select("id, name, name_bn, category, price, image_url, is_active, sizes, buy_link").eq("brand_id", bid).order("created_at", { ascending: false });
      setProducts(data ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name, name_bn: p.name_bn ?? "", category: p.category ?? "",
      price: String(p.price), image_url: p.image_url ?? "",
      sizes: (p.sizes ?? []).join(", "), buy_link: p.buy_link ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!brandId || !form.name.trim()) return;
    setSaving(true);
    const payload = {
      brand_id: brandId,
      name: form.name.trim(),
      name_bn: form.name_bn.trim() || null,
      category: form.category.trim() || null,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url.trim() || null,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      buy_link: form.buy_link.trim() || null,
    };

    try {
      if (editId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editId);
        if (error) throw error;
        setProducts((p) => p.map((x) => (x.id === editId ? { ...x, ...payload } : x)));
        toast({ title: "Product updated" });
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        setProducts((p) => [data, ...p]);
        toast({ title: "Product added" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("products").update({ is_active: active }).eq("id", id);
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, is_active: active } : x)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
    toast({ title: "Product deleted" });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Name (EN) *</Label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Product name" />
                </div>
                <div className="space-y-2">
                  <Label>Name (Bengali)</Label>
                  <Input value={form.name_bn} onChange={(e) => update("name_bn", e.target.value)} placeholder="বাংলা নাম" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Tops" />
                </div>
                <div className="space-y-2">
                  <Label>Price (BDT)</Label>
                  <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sizes (comma separated)</Label>
                <Input value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="S, M, L, XL" />
              </div>
              <div className="space-y-2">
                <Label>Buy Link</Label>
                <Input value={form.buy_link} onChange={(e) => update("buy_link", e.target.value)} placeholder="https://..." />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editId ? "Update" : "Add"} Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="glass-card border-border/50 overflow-hidden">
              {p.image_url && (
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm">{p.name}</h3>
                    {p.category && <span className="text-xs text-muted-foreground">{p.category}</span>}
                  </div>
                  <span className="text-sm font-bold text-primary">৳{p.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={p.is_active} onCheckedChange={(v) => toggleActive(p.id, v)} />
                    <span className="text-xs text-muted-foreground">{p.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
