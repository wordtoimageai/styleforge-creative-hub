import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    subdomain: "",
    email: "",
    password: "",
    contactName: "",
    phone: "",
    termsAccepted: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.termsAccepted) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }
    if (!form.subdomain.match(/^[a-z0-9-]+$/)) {
      toast({ title: "Subdomain must be lowercase letters, numbers, and hyphens only", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (authError) throw authError;

      if (authData.user) {
        const { error: brandError } = await supabase.from("brands").insert({
          user_id: authData.user.id,
          business_name: form.businessName,
          subdomain: form.subdomain,
          email: form.email,
          contact_name: form.contactName || null,
          phone: form.phone || null,
          terms_accepted_at: new Date().toISOString(),
        });
        if (brandError) throw brandError;
      }

      toast({ title: "Account created! Check your email to verify." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: err.message || "Signup failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-heading text-sm font-bold text-primary-foreground">BD</span>
            </div>
            <span className="font-heading text-xl font-bold">BDai.studio</span>
          </div>
          <h1 className="text-2xl font-heading font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your AI fashion studio today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>Business Name *</Label>
            <Input required value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="My Fashion Brand" />
          </div>

          <div className="space-y-2">
            <Label>Subdomain *</Label>
            <div className="flex">
              <Input required value={form.subdomain} onChange={(e) => update("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="mybrand" className="rounded-r-none" />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">.bdai.studio</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label>Password *</Label>
            <Input required type="password" minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 6 characters" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+880..." />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="terms" checked={form.termsAccepted} onCheckedChange={(v) => update("termsAccepted", !!v)} />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I accept the Terms of Service & Privacy Policy
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
