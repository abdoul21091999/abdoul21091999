// HI-TECH — Assemble le catalogue
// Lit chaque fiche produit de data/produits/*.json (une par produit, éditées depuis /admin)
// et produit data/produits.json, le fichier que lit le site.
// Lancé automatiquement par Netlify à chaque modification (voir netlify.toml).
//   node outils/construire-catalogue.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "produits");
const num = (v) => (v === "" || v == null || isNaN(+v) ? 0 : +v);
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v != null && !(Array.isArray(v) && !v.length)));

const produits = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  let p;
  try { p = JSON.parse(readFileSync(join(dir, f), "utf8")); }
  catch (e) { console.warn("Fiche ignorée (JSON invalide) :", f); continue; }
  if (!p.name || !p.cat) { console.warn("Fiche ignorée (nom ou catégorie manquant) :", f); continue; }
  p.id = f.replace(/\.json$/, "");
  p.price = num(p.price);
  if (p.oldPrice) p.oldPrice = num(p.oldPrice);
  if (p.dispo === undefined) p.dispo = true;
  if (Array.isArray(p.colors)) p.colors = p.colors.filter((c) => c && c.name).map(clean);
  if (Array.isArray(p.options)) p.options = p.options.map(String).map((s) => s.trim()).filter(Boolean);
  produits.push(clean(p));
}
produits.sort((a, b) => num(a.ordre || 9999) - num(b.ordre || 9999) || a.name.localeCompare(b.name));
// Réglages généraux (ex. « Afficher les prix »), modifiables depuis /admin
let reglages = {};
try { reglages = JSON.parse(readFileSync(join(root, "data", "reglages.json"), "utf8")); } catch (e) {}
writeFileSync(join(root, "data", "produits.json"), JSON.stringify({ reglages, produits }) + "\n");
console.log(`Catalogue : ${produits.length} produits → data/produits.json (prix ${reglages.afficherPrix === false ? "masqués" : "affichés"})`);
