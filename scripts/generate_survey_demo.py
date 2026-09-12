"""Deterministic, fictitious survey. No real respondent data or validated scale."""
import csv, random
from pathlib import Path
rng = random.Random(20260911)
root = Path(__file__).resolve().parents[1] / 'public/examples'
meta = 'respondent_id team site contract seniority role_level remote_days age_band schedule department manager workload_band training mobility sector service_size'.split()
categories = ['PGC','EVPVP','RECO','COM','JUST','ENG','CONF','EQUI']
header = meta + [c for k in categories for c in [k+'1',k+'2',k+'3','MOY_'+k]]
rows, xy = [], []
for i in range(240):
    dept = ['Opérations','Support','Produit','Commercial'][i//60]
    base = rng.gauss(0,.65)
    latent = {k:3.4+base+rng.gauss(0,.4) for k in categories}
    if dept == 'Opérations': latent['EVPVP'] -= .9; latent['PGC'] -= .5
    if dept == 'Support': latent['RECO'] -= .8; latent['COM'] -= .6
    latent['ENG'] = .55*latent['RECO']+.45*(3.4+base)+rng.gauss(0,.35)
    row = [f'SYN-{i+1:03}',f'Équipe {i//20+1}','Site fictif','CDI',str(i%12),'Collaborateur',str(i%4),'Non renseigné','Mixte',dept,'Non','Simulée','Oui','Non','Fictif','60']
    means={}
    for k in categories:
        items=[max(1,min(5,int(latent[k]+rng.gauss(0,.65)+.5))) if rng.random()>.02 else '' for _ in range(3)]
        valid=[v for v in items if v!='']; mean=sum(valid)/len(valid) if len(valid)>=2 else None
        row += items + [f'{mean:.2f}' if mean is not None else '']; means[k]=mean
    rows.append(row)
    xy.append([round((means['PGC'] or 3)-3+rng.uniform(-.08,.08),4),round((means['ENG'] or 3)-3+rng.uniform(-.08,.08),4)])
with (root/'survey_sample.csv').open('w',newline='') as f:
    w=csv.writer(f, lineterminator='\n');w.writerow(header);w.writerows(rows)
with (root/'projection_sample.csv').open('w',newline='') as f:
    w=csv.writer(f, lineterminator='\n');w.writerow(['x','y']);w.writerows(xy)
