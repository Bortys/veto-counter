(async function(){
  const { $, fmtDateTime, setCurrentNav, loadMode, toggleMode, fetchJSON } = window.App;
  setCurrentNav(); loadMode();
  const btn = $('#toggleModeBtn'); if(btn) btn.addEventListener('click', toggleMode);

  try{
    const [stats, conf] = await Promise.all([
      fetchJSON('api/v1/stats.json'),
      fetchJSON('api/v1/site.json')
    ]);
    $('#subjectName').textContent = conf.subject.name;
    $('#termStart').textContent = conf.subject.termStart;
    $('#countVeto').textContent = String(stats.counters.vetoedActs).padStart(4,'0');
    $('#vetoedActs').textContent = stats.counters.vetoedActs;
    $('#vetoEvents').textContent = stats.counters.vetoEvents;
    $('#tkReferrals').textContent = stats.counters.tkReferrals;
    $('#lastUpdated').textContent = fmtDateTime(stats.generatedAt);
  }catch(e){
    console.error(e);
    const err=$('#loadError'); if(err) err.hidden=false;
  }

  try{
    const vetoes = await fetchJSON('api/v1/vetoes.json');
    const items=(vetoes.items||[]).slice().sort((a,b)=>(b.vetoDate||'').localeCompare(a.vetoDate||''));
    const last=items[0];
    if(last){
      $('#lastVetoTitle').textContent = last.actTitle || '—';
      $('#lastVetoDate').textContent = last.vetoDate || '—';
      $('#lastVetoLink').href = last.presidentSite?.eventUrl || '#';
      $('#lastVetoLink').textContent = last.presidentSite?.eventUrl ? 'Zobacz źródło (prezydent.pl)' : 'Brak linku źródłowego';
      $('#lastVetoPrint').textContent = last.parliament?.sejm?.printNo ? `Druk sejmowy: ${last.parliament.sejm.printNo}` : 'Druk sejmowy: —';
      $('#lastVetoStatus').textContent = last.parliament?.sejm?.status ? `Status: ${last.parliament.sejm.status}` : 'Status: —';
    }
  }catch(e){ console.warn(e); }
})();
