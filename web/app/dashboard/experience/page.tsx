"use client";

import { useEffect, useState } from "react";
import { Experience } from "@/types";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { apiInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Experience>>({
    role: "",
    company: "",
    location: "",
    period: "",
    responsibilities: [],
    achievements: [],
    technologies: [],
    order: 0,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await apiInstance.get("/experience");
      setExperiences(data?.data || data || []);
    } catch (error) {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiInstance.patch(`/experience/${editingId}`, formData);
      } else {
        await apiInstance.post("/experience", formData);
      }

      toast.success(`Experience ${editingId ? "updated" : "created"} successfully!`);
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        role: "",
        company: "",
        location: "",
        period: "",
        responsibilities: [],
        achievements: [],
        technologies: [],
        order: 0,
      });
      fetchExperiences();
    } catch (error) {
      toast.error("Error saving experience");
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id!);
    setFormData(exp);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await apiInstance.delete(`/experience/${id}`);
      toast.success("Experience deleted");
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  const handleArrayChange = (field: keyof Experience, value: string) => {
    setFormData({ ...formData, [field]: value.split("\n").filter(i => i.trim() !== "") });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto text-zinc-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Experience Management</h1>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setFormData({
              role: "", company: "", location: "", period: "", responsibilities: [], achievements: [], technologies: [], order: 0
            });
          }}
          variant="outline"
          className="flex items-center gap-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "Cancel" : "Add Experience"}
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-12 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold mb-4">{editingId ? "Edit" : "New"} Experience Node</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" required type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Remote, USA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Input id="period" required type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} placeholder="Jan 2023 - Present" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Sort Order (0 is first)</Label>
              <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-zinc-800 mt-6">
            <div className="space-y-2">
              <Label htmlFor="responsibilities" className="text-emerald-500">Responsibilities (One per line)</Label>
              <Textarea id="responsibilities" rows={4} value={formData.responsibilities?.join("\n")} onChange={(e) => handleArrayChange("responsibilities", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievements" className="text-emerald-500">Achievements (One per line)</Label>
              <Textarea id="achievements" rows={3} value={formData.achievements?.join("\n")} onChange={(e) => handleArrayChange("achievements", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-emerald-500">Technologies (One per line)</Label>
              <Textarea id="technologies" rows={2} value={formData.technologies?.join("\n")} onChange={(e) => handleArrayChange("technologies", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" className="flex items-center gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
              <Check size={16} /> Save Experience
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading experiences...</div>
      ) : (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
              No experiences found. Add your first one above.
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                    <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono">Order: {exp.order}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">{exp.company} • {exp.period}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)} className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id!)} className="text-zinc-400 hover:text-red-500 bg-zinc-800 hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
