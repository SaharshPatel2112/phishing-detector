"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { KeyRound, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";

type Keyword = { id: string; phrase: string; weight: number };

export default function Admin() {
  const { getToken } = useAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");

  async function loadKeywords() {
    const token = await getToken();
    const res = await fetch("http://localhost:5000/api/admin/keywords", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      setError("Admin access is restricted to the project owner's account.");
      return;
    }
    setKeywords(await res.json());
  }

  useEffect(() => {
    loadKeywords();
  }, []);

  async function handleAdd() {
    if (!phrase) return;
    const token = await getToken();
    await fetch("http://localhost:5000/api/admin/keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phrase }),
    });
    setPhrase("");
    loadKeywords();
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    await fetch(`http://localhost:5000/api/admin/keywords/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadKeywords();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section
        className="px-8 py-16"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <span className="text-sm font-semibold text-primary">ADMIN</span>
          <h1 className="mt-2 text-2xl font-bold">
            Manage suspicious keywords
          </h1>

          {error ? (
            <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          ) : (
            <>
              <div className="mt-6 flex gap-3">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="e.g. confirm your billing details"
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                />
                <button
                  onClick={handleAdd}
                  className="rounded-lg bg-primary px-6 py-3 font-medium text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <KeyRound size={16} className="text-primary" />
                  {keywords.length} keyword{keywords.length !== 1 ? "s" : ""}
                </div>
                <ul className="flex flex-col gap-2">
                  {keywords.map((k) => (
                    <li
                      key={k.id}
                      className="flex items-center justify-between rounded-lg bg-background px-4 py-2"
                    >
                      <span className="text-sm">{k.phrase}</span>
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
