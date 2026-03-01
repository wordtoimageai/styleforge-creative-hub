import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Copy } from "lucide-react";

const FONTS = ["Inter", "Syne", "Outfit", "Poppins", "DM Sans", "Space Grotesk"];

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [form, setForm] = useState({
    logo_url: "",
    primary_color: "#6366f1",
    secondary_color: "#ec4899",
    font_family: "Inter",
    custom_domain: "",
    api_key: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("brands")
        .select("id, logo_url, primary_color, secondary_color, font_family, custom_domain, api_key")
        .eq("user_id", user.id)
        .limit(1);
      const b = data?.[0];
      if (b) {
        setBrandId(b.id);
        setForm({
          logo_url: b.logo_url ?? "",
          primary_color: b.primary_color ?? "#6366f1",
          secondary_color: b.secondary_color ?? "#ec4899",
          font_family: b.font_family ?? "Inter",
          custom_domain: b.custom_domain ?? "",
          api_key: b.api_key ?? "",
        });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!brandId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("brands").update({
        logo_url: form.logo_url || null,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        font_family: form.font_family,
        custom_domain: form.custom_domain || null,
      }).eq("id", brandId);
      if (error) throw error;
      toast({ title: "Settings saved" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(form.api_key);
    toast({ title: "API key copied" });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      <Card className="glass-card border-border/50">
        <CardHeader><CardTitle className="text-lg">Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={form.logo_url} onChange={(e) => update("logo_url", e.target.value)} placeholder="https://..." />
            {form.logo_url && <img src={form.logo_url} alt="Logo" className="h-12 w-12 rounded-lg object-contain bg-muted p-1" />}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <input type="color" value={form.primary_color} onChange={(e) => update("primary_color", e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent" />
                <Input value={form.primary_color} onChange={(e) => update("primary_color", e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <input type="color" value={form.secondary_color} onChange={(e) => update("secondary_color", e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent" />
                <Input value={form.secondary_color} onChange={(e) => update("secondary_color", e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={form.font_family} onValueChange={(v) => update("font_family", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50">
        <CardHeader><CardTitle className="text-lg">Domain & API</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Custom Domain</Label>
            <Input value={form.custom_domain} onChange={(e) => update("custom_domain", e.target.value)} placeholder="shop.example.com" />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input value={form.api_key} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={copyApiKey}><Copy className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground">Use this key to integrate with external apps.</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Settings
      </Button>
    </div>
  );
}
