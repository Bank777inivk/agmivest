"use client";

import { LayoutDashboard, Users, FileText, Settings, LogOut, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-ely-blue text-white flex flex-col pt-8">
        <div className="px-6 mb-12">
          <img src="/logo.png" alt="AGM INVEST" className="h-12 bg-white p-1 rounded-lg" />
          <span className="text-xs font-bold tracking-tight uppercase block mt-2 opacity-80">ADMIN PANEL</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                item.active ? "bg-white/10 text-ely-mint" : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors text-sm font-medium w-full">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier, un client..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">Admin AGM INVEST</p>
                <p className="text-[10px] text-slate-500 uppercase">Super Utilisateur</p>
              </div>
              <div className="w-10 h-10 bg-ely-mint rounded-full flex items-center justify-center text-white font-bold">
                AE
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
            <p className="text-slate-500">Aperçu global de l&apos;activité des prêts.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-full", stat.color)}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Demandes Récentes</h3>
              <button className="text-sm font-bold text-ely-blue hover:text-ely-mint">Voir tout</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{app.name}</p>
                        <p className="text-xs text-slate-500">{app.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{app.amount.toLocaleString()} €</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                          app.statut === "En attente" ? "bg-amber-100 text-amber-700" :
                            app.statut === "Approuvé" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {app.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {app.date}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-xs font-bold text-ely-blue hover:underline">Gérer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Dossiers Prêts", icon: FileText, active: false },
  { label: "Utilisateurs", icon: Users, active: false },
  { label: "Configuration", icon: Settings, active: false },
];

const stats = [
  { label: "Total Demandes", value: "1,284", trend: "+12%", color: "bg-emerald-100 text-emerald-700" },
  { label: "En attente", value: "43", trend: "-5%", color: "bg-amber-100 text-amber-700" },
  { label: "Approuvées", value: "892", trend: "+18%", color: "bg-emerald-100 text-emerald-700" },
  { label: "Refusées", value: "349", trend: "+2%", color: "bg-red-100 text-red-700" },
];

const recentApps = [
  { id: 1, name: "Jean Dupont", email: "j.dupont@email.com", amount: 250000, statut: "En attente", date: "21 Jan 2026" },
  { id: 2, name: "Marie Curie", email: "m.curie@email.com", amount: 480000, statut: "Approuvé", date: "20 Jan 2026" },
  { id: 3, name: "Robert Fox", email: "r.fox@email.com", amount: 120000, statut: "En attente", date: "19 Jan 2026" },
  { id: 4, name: "Alice Green", email: "a.green@email.com", amount: 350000, statut: "Refusé", date: "18 Jan 2026" },
];
