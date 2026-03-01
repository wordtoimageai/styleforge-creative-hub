import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, CalendarDays, Gauge, Plus, ExternalLink, Palette, Loader2 } from "lucide-react";

interface BrandData {
  id: string;
  business_name: string;
  subdomain: string;
  monthly_limit: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [stats, setStats] = useState({ products: 0, totalSessions: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data: brands } = await supabase
        .from("brands")
        .select("id, business_name, subdomain, monthly_limit")
        .eq("user_id", user.id)
        .limit(1);

      const b = brands?.[0];
      if (!b) { setLoading(false); return; }
      setBrand(b);

      const [{ count: productCount }, { count: totalCount }, { count: monthCount }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }).eq("brand_id", b.id),
        supabase.from("usage_logs").select("*", { count: "exact", head: true }).eq("brand_id", b.id),
        supabase.from("usage_logs").select("*", { count: "exact", head: true }).eq("brand_id", b.id)
          .gte("timestamp", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      setStats({
        products: productCount ?? 0,
        totalSessions: totalCount ?? 0,
        thisMonth: monthCount ?? 0,
      });
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!brand) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">No brand found. Please sign up first.</p>
        <Button onClick={() => navigate("/signup")}>Create Brand</Button>
      </div>
    );
  }

  const remaining = brand.monthly_limit - stats.thisMonth;

  const statCards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Total Sessions", value: stats.totalSessions, icon: BarChart3, color: "text-secondary" },
    { label: "This Month", value: stats.thisMonth, icon: CalendarDays, color: "text-accent" },
    { label: "Remaining", value: Math.max(0, remaining), icon: Gauge, color: remaining > 0 ? "text-primary" : "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{brand.business_name}</h1>
        <p className="text-sm text-muted-foreground">{brand.subdomain}.bdai.studio</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-bold">{s.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button onClick={() => navigate("/products")} className="h-auto py-4 flex-col gap-2">
          <Plus className="h-5 w-5" />
          Add Products
        </Button>
        <Button variant="outline" onClick={() => window.open(`https://${brand.subdomain}.bdai.studio`, "_blank")} className="h-auto py-4 flex-col gap-2">
          <ExternalLink className="h-5 w-5" />
          View App
        </Button>
        <Button variant="outline" onClick={() => navigate("/settings")} className="h-auto py-4 flex-col gap-2">
          <Palette className="h-5 w-5" />
          Customize
        </Button>
      </div>
    </div>
  );
}
