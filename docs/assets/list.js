(async function(){
  const { $, $$, setCurrentNav, loadMode, toggleMode, fetchJSON } = window.App;
  setCurrentNav(); loadMode();
  const btn=$('#toggleModeBtn'); if(btn) btn.addEventListener('click', toggleMode);

  let vetoes=[];
  try{ vetoes = (await fetchJSON('api/v1/vetoes.json')).items || []; }
  catch(e){ console.error(e); $('#loadError').hidden=false; return; }

  const q=$('#q'), year=$('#year'), status=$('#status'), needsReview=$('#needsReview');
  const uniq=a=>Array.from(new Set(a)).filter(Boolean).sort();
  uniq(vetoes.map(v=>(v.vetoDate||'').slice(0,4))).forEach(y=>year.append(new Option(y,y)));
  uniq(vetoes.map(v=>v.parliament?.sejm?.status||'')).forEach(s=>status.append(new Option(s||'—',s)));

  const esc=s=>String(s).replace(/[&<>"]/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const escAttr=s=>esc(s).replace(/'/g,"&#39;");

  function tagHTML(tags){
    if(!tags||!tags.length) return '<span class="small">—</span>';
    return tags.slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join('');
  }
  function linkCell(v){
    const links=[];
    const pu=v.presidentSite?.eventUrl; if(pu) links.push(`<a href="${escAttr(pu)}" target="_blank" rel="noopener">prezydent.pl</a>`);
    const sp=v.parliament?.sejm?.apiUrl; if(sp) links.push(`<a href="${escAttr(sp)}" target="_blank" rel="noopener">Sejm API</a>`);
    const pdf0=(v.presidentSite?.pdfUrls||[])[0]; if(pdf0) links.push(`<a href="${escAttr(pdf0)}" target="_blank" rel="noopener">PDF</a>`);
    return links.length?links.join(' · '):'<span class="small">—</span>';
  }

  function apply(){
    const qq=(q.value||'').trim().toLowerCase(), yy=year.value, ss=status.value, nr=needsReview.checked;
    let rows=vetoes.slice();
    if(yy) rows=rows.filter(v=>(v.vetoDate||'').startsWith(yy));
    if(ss) rows=rows.filter(v=>(v.parliament?.sejm?.status||'')===ss);
    if(nr) rows=rows.filter(v=>v.quality?.needsReview);
    if(qq) rows=rows.filter(v=>(v.actTitle||'').toLowerCase().includes(qq) || (v.vetoDate||'').includes(qq));
    rows.sort((a,b)=>(b.vetoDate||'').localeCompare(a.vetoDate||''));
    $('#count').textContent=rows.length;
    $('#tbody').innerHTML = rows.map(v=>`
      <tr>
        <td><span class="small">${esc(v.vetoDate||'—')}</span></td>
        <td><div style="font-weight:650">${esc(v.actTitle||'—')}</div><div class="small">ID: <span style="font-family:var(--mono)">${esc(v.id||'—')}</span></div></td>
        <td>${esc(v.parliament?.sejm?.printNo||'—')}</td>
        <td>${esc(v.parliament?.sejm?.status||'—')}${v.quality?.needsReview?' <span class="tag">wymaga weryfikacji</span>':''}</td>
        <td>${tagHTML(v.topicTags)}</td>
        <td>${linkCell(v)}</td>
      </tr>
    `).join('');
  }
  [q,year,status,needsReview].forEach(el=>el.addEventListener('input',apply));
  apply();
})();
