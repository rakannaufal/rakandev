// Synthetic Indonesian business records. No customer or employee data is used.
export function enrichDemoState(state,config){
  state.leads.push(...[
    ['lead-3','Bima','Kedai Aksara',2400000,'Dihubungi'],['lead-4','Kirana','Studio Kirana',3200000,'Proposal'],
    ['lead-5','Rafi','Rafi Furniture',1800000,'Menang'],['lead-6','Sari','Sari Living',950000,'Baru'],
  ].map(([id,name,company,amount,status])=>({id,name:name+' (contoh)',company,amount,status})));
  state.projects.push(
    {id:'project-2',name:config.scenario==='construction'?'Penataan kantor Aksara':'Website Kedai Aksara',owner:'Bima (contoh)',budget:4200000,progress:50,hours:12,status:'Berjalan'},
    {id:'project-3',name:config.scenario==='construction'?'Ruang kerja Kirana':'Identitas Studio Kirana',owner:'Sari (contoh)',budget:3500000,progress:100,hours:20,status:'Selesai'},
  );
  state.documents.push({id:'document-2',name:'Penawaran layanan Oktober',version:2,status:'Draf'},{id:'document-3',name:'Panduan penerimaan barang',version:1,status:'Draf'});
  state.maintenance.push({id:'maintenance-2',name:'Printer gudang',schedule:'2026-10-22',status:'Dijadwalkan'},{id:'maintenance-3',name:'Komputer operasional',schedule:'2026-10-11',status:'Selesai'});
  state.tickets.push({id:'ticket-2',name:'Perubahan alamat pengiriman',customer:'Bima (contoh)',status:'Terbuka'},{id:'ticket-3',name:'Permintaan panduan produk',customer:'Sari (contoh)',status:'Selesai'});
  state.users.push({id:'user-2',name:'Bima (contoh)',role:'Operator',status:'Aktif'},{id:'user-3',name:'Sari (contoh)',role:'Pembaca',status:'Aktif'});
  const records={
    healthcare:[['Kirana (pasien fiktif)','Dokter Bima (fiktif)',175000,'Menunggu'],['Rafi (pasien fiktif)','Dokter Dira (fiktif)',125000,'Diperiksa']],
    education:[['Kirana (siswa fiktif)','Kelas bahasa',350000,'Belum dibayar'],['Rafi (siswa fiktif)','Kelas coding',650000,'Belum dibayar']],
    agribusiness:[['Blok B','Cabai',750000,'Budidaya'],['Blok C','Sayuran',550000,'Budidaya']],
    property:[['Unit Luma 02','Tipe 60',725000000,'Tersedia'],['Unit Luma 03','Tipe 72',850000000,'Tersedia']],
  };
  if(records[config.scenario])state.sector.push(...records[config.scenario].map(([name,detail,amount,status],i)=>({id:'sector-'+(i+2),name,detail,amount,status,...(config.scenario==='agribusiness'?{yield:0}:{}),...(config.scenario==='property'?{paid:0,progress:0}:{})})));
  return state;
}
