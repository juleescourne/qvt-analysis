import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/utils/survey.js', import.meta.url), 'utf8');
const { filterRows, distribution, rating, questionColumns } = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const header=['id','department',...Array(14).fill('meta'),'RECO1','ENG1','MOY_RECO'];
const rows=[['a','Support',...Array(14).fill(''),1,2,1.67],['b','Produit',...Array(14).fill(''),1,5,2.33],['c','Support',...Array(14).fill(''),5,5,4.67],['d','Support',...Array(14).fill(''),'','4x','']];
test('a clicked response selects the same respondent identities in every distribution',()=>{
 const selected=filterRows(rows,header,{RECO1:1});
 assert.deepEqual(selected.map(r=>r[0]),['a','b']);
 assert.deepEqual(distribution(selected,header,'ENG1').counts,[0,1,0,0,1]);
 assert.deepEqual(distribution(selected,header,'RECO1').counts,[2,0,0,0,0]);
});
test('question and department filters intersect; clearing restores the population',()=>{
 assert.deepEqual(filterRows(rows,header,{RECO1:1,ENG1:5}).map(r=>r[0]),['b']);
 assert.deepEqual(filterRows(rows,header,{RECO1:1,ENG1:5},'Support'),[]);
 assert.equal(filterRows(rows,header,{}).length,4);
});
test('invalid responses are excluded, decimal category means are rounded only for bins',()=>{
 assert.equal(rating('4x'),null);assert.equal(rating('2.9'),null);assert.equal(rating(''),null);
 assert.equal(rating('2,67',true),3);
 const d=distribution(rows,header,'MOY_RECO');assert.equal(d.n,3);assert.equal(d.missing,1);assert.deepEqual(d.counts,[0,2,0,0,1]);assert.ok(Math.abs(d.mean-2.89)<.01);
 assert.deepEqual(questionColumns(header),['RECO1','ENG1']);
});
test('synthetic dataset has balanced departments, stable identity and aligned coordinates',()=>{
 const csv=readFileSync(new URL('../public/examples/survey_sample.csv',import.meta.url),'utf8').trim().split(/\r?\n/).map(x=>x.split(','));
 const xy=readFileSync(new URL('../public/examples/projection_sample.csv',import.meta.url),'utf8').trim().split(/\r?\n/);
 assert.equal(csv.length,241);assert.equal(xy.length,csv.length);assert.equal(new Set(csv.slice(1).map(r=>r[0])).size,240);
 for(const name of ['Opérations','Support','Produit','Commercial'])assert.equal(csv.slice(1).filter(r=>r[9]===name).length,60);
 assert.ok(csv.slice(1).some(r=>r.slice(16).includes('')));
});
