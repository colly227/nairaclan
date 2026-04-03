import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Sun, Moon, Bell, Settings2 } from "lucide-react";

/* ═══════════════════════════════════════════ SUPABASE CONFIG ═══════════════════════════════════════════
   When deploying: set USE_MOCK=false and ensure Supabase project is configured.
   In artifact preview: mock data is used for full functionality.
*/
const SUPABASE_URL = "https://ncufqsqwipjhdmiwhumq.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdWZxc3F3aXBqaGRtaXdodW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjA0MDgsImV4cCI6MjA5MDY5NjQwOH0.9HLNZ-piXZ-mQO7TqnbkmGSY-T0mFzkf8gT2zEepvAY";
const USE_MOCK = true; // Set false for real Supabase

/* ═══════════════════════════════════════════ NIGERIA DATA ═══════════════════════════════════════════ */
const NIGERIA_STATE_LGAS = {
  "Abia":["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],
  "Adamawa":["Demsa","Fufore","Ganye","Girei","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo-Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],
  "Lagos":["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
  "Kano":["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
  "Rivers":["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emohua","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],
  "FCT":["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
  "Oyo":["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogo Oluwa","Ogbomosho North","Ogbomosho South","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
  "Kaduna":["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
  "Delta":["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North-East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South-West"],
  "Enugu":["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo-Uwani"],
  "Anambra":["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
  "Akwa Ibom":["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono-Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai","Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung-Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo"],
  "Bauchi":["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],
  "Bayelsa":["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],
  "Benue":["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],
  "Borno":["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
  "Cross River":["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakurr","Yala"],
  "Ebonyi":["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],
  "Edo":["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
  "Ekiti":["Ado Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],
  "Gombe":["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"],
  "Imo":["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Onuimo","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West"],
  "Jigawa":["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],
  "Katsina":["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa","Dandume","Danja","Daura","Dutsi","Dutsin-Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],
  "Kebbi":["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],
  "Kogi":["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela-Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa-Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],
  "Kwara":["Asa","Baruten","Edu","Ekiti (Kwara)","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
  "Nasarawa":["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Eggon","Obi","Toto","Wamba"],
  "Niger":["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edatti","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Muya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],
  "Ogun":["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North-East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Sagamu","Yewa North","Yewa South"],
  "Ondo":["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],
  "Osun":["Aiyedaade","Aiyedire","Atakunmosa East","Atakunmosa West","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],
  "Plateau":["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
  "Sokoto":["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"],
  "Taraba":["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kurmi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],
  "Yobe":["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],
  "Zamfara":["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Tsafe","Zurmi"],
};
const ALL_STATES = Object.keys(NIGERIA_STATE_LGAS).sort();
const CATEGORIES = [{name:"News"},{name:"Jobs"},{name:"Events"},{name:"Mentorship"},{name:"Community Dev"},{name:"Community Issues"},{name:"For Sale"},{name:"Missing Persons"},{name:"Crime Alerts"}];
const TAG_HUE = {News:150,Jobs:210,Events:30,Mentorship:270,"Community Dev":180,"Community Issues":0,"For Sale":45,"Missing Persons":290,"Crime Alerts":350};
const AVATAR_COLORS = ["#059669","#0891b2","#7c3aed","#db2777","#ea580c","#ca8a04","#2563eb","#dc2626","#4f46e5","#16a34a"];
const gc = (n) => AVATAR_COLORS[n.charCodeAt(0) % 10];
const stripHtml = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent || d.innerText || ""; };
const gi = (n) => n.slice(0,2).toUpperCase();
const ROLE_BADGES = {super_admin:"👑",admin:"🛡️",state_mod:"🏛️",lga_mod:"🏘️"};

/* ═══════════════════════════════════════════ BOT USER SYSTEM ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════ BOT USER SYSTEM ═══════════════════════════════════════════ */
const NG_FIRST=["Chidi","Amina","Tunde","Ngozi","Ibrahim","Fatima","Obinna","Yusuf","Aisha","Emeka","Bola","Halima","Kemi","Musa","Chinwe","Segun","Hauwa","Chioma","Aliyu","Funke","Ikenna","Rashida","Dayo","Suleiman","Nneka","Femi","Zainab","Uche","Bashir","Adaeze","Gbenga","Hadiza","Obi","Abdullahi","Ifeoma","Jide","Safiya","Nnamdi","Kabiru","Amaka"];
const NG_SUR=["Okafor","Ibrahim","Adeyemi","Mohammed","Nwosu","Abubakar","Eze","Bello","Obi","Yusuf","Adebayo","Aliyu","Nwachukwu","Suleiman","Olawale","Musa","Chukwu","Garba","Okeke","Balogun"];
const HANDLE_WORDS=["Vibes","King","Queen","Boss","Chief","Citizen","Watcher","Voice","Talk","Pikin","Thinker","Rider","Hunter","Seeker","Tracker","Baller","Realist","Hustler","Champ","Legend","Coder","Geek","Guru","Sage","Eagle","Lion","Star","Flash","Blaze","Storm","Razor","Ace","Nova","Pulse","Volt","Fixer","Spark","Wave","Drift","Edge"];
const HANDLE_PREFIX=["Naija","9ja","Omo","Real","Just","Big","Lil","Don","Sir","No","Talk","One","El","Mr","De","Da","Oga"];
const HANDLE_SUFFIX=["_ng","_9ja","247","_real","101","_ok","_1","official","_hub","_tv","vibes","talks","says","daily","zone","world","spot","inc","hq","base"];
const CITY_TAGS={"Lagos":"Lag","Rivers":"PH","Kano":"KN","Abuja":"ABJ","Oyo":"Ibdn","Delta":"Warri","Anambra":"Nnewi","Enugu":"Coal","Kaduna":"KD","Borno":"Maid","Edo":"Benin","Ogun":"Abk","Imo":"Owerri","Abia":"Aba","Cross River":"Cal","Bayelsa":"Yen","Kwara":"Ilrn","Plateau":"Jos","Benue":"Mkd","Sokoto":"Sok"};
const NG_TITLES=["Civic Voice","Community Advocate","Local Watcher","Concerned Citizen","Active Member","Town Crier","Naija Observer","Community Builder","Policy Tracker","Grassroots Voice","Forum Regular","Civic Champion","Governance Watch","Street Analyst","Community First","Youth Voice","Democracy Watch","Ward Reporter","Public Eye","Accountability Now"];

function genBotUsers(){
  const bots={};const used=new Set();
  const h=(s,i)=>((s.charCodeAt(0)*31+s.charCodeAt(Math.min(1,s.length-1))*17+i*13+s.length*7)>>>0);
  ALL_STATES.forEach(state=>{
    const lgas=NIGERIA_STATE_LGAS[state]||[];const tag=CITY_TAGS[state]||state.slice(0,3);const stBots=[];
    for(let i=0;i<20;i++){
      const seed=h(state,i);let un;
      if(i<8){
        const fn=NG_FIRST[(seed+i*7)%NG_FIRST.length];
        const sn=NG_SUR[(seed+i*11)%NG_SUR.length];
        const suf=["","_ng","Real","_1",""][i%5];
        un=fn+sn+suf;
      }else if(i<12){
        const w=HANDLE_WORDS[(seed+i*3)%HANDLE_WORDS.length];
        un=tag+w+((seed+i)%99+1);
      }else if(i<16){
        const pf=HANDLE_PREFIX[(seed+i*5)%HANDLE_PREFIX.length];
        const w=HANDLE_WORDS[(seed+i*9)%HANDLE_WORDS.length];
        const sf=HANDLE_SUFFIX[(seed+i)%HANDLE_SUFFIX.length];
        un=pf+w+sf;
      }else{
        const styles=[
          tag+"_"+HANDLE_WORDS[(seed+i*4)%HANDLE_WORDS.length].toLowerCase()+((seed+i)%999),
          HANDLE_PREFIX[(seed+i*6)%HANDLE_PREFIX.length]+"_"+tag.toLowerCase()+((seed*i)%99+1),
          HANDLE_WORDS[(seed+i)%HANDLE_WORDS.length].toLowerCase()+tag+HANDLE_SUFFIX[(seed+i*2)%HANDLE_SUFFIX.length],
          tag.toLowerCase()+"boy"+((seed+i)%99+1)+"_ng"
        ];
        un=styles[i%styles.length];
      }
      un=un.replace(/[^a-zA-Z0-9_]/g,"").slice(0,18);
      // Collision-safe: append state abbreviation + index if duplicate
      let final=un;let c=0;
      while(used.has(final.toLowerCase())){final=un+"_"+tag.toLowerCase()+(++c)}
      used.add(final.toLowerCase());
      const lga=lgas[i%lgas.length]||lgas[0]||"";
      stBots.push({
        id:"bot_"+state.slice(0,3).toLowerCase()+"_"+i,
        username:final,
        name:NG_FIRST[(i*7+h(state,0))%NG_FIRST.length]+" "+NG_SUR[(i*11+state.length)%NG_SUR.length],
        email:final.toLowerCase()+"@nairaclan.ng",
        origin:state,residence:state,lga,lgaResidence:lga,
        role:"member",strikes:0,status:"active",posts:Math.floor(Math.random()*20)+1,
        followers:Math.floor(Math.random()*50)+5,following:Math.floor(Math.random()*30)+3,
        bio:"Proud citizen of "+state+" State. Passionate about community development.",
        title:NG_TITLES[i%NG_TITLES.length],
        isBot:true,botActive:true
      });
    }
    bots[state]=stBots;
  });
  return bots;
}
const BOT_USERS=genBotUsers();
const ALL_BOTS=Object.values(BOT_USERS).flat();

/* ═══════════════════════════════════════════ MOCK DATA ═══════════════════════════════════════════ */
const MU = [
  {id:"u0",username:"NairaBoss",name:"Don Victor",email:"vickydocs67@gmail.com",origin:"Rivers",residence:"Rivers",lga:"Port Harcourt",lgaResidence:"Obio/Akpor",role:"super_admin",strikes:0,status:"active",posts:0,followers:0,following:0,bio:"NairaClan Super Administrator. Building Nigeria's premier civic forum.",title:"Super Admin",assignedStates:ALL_STATES},
  {id:"u1",username:"ChiefAda",name:"Ada Okafor",email:"ada@test.ng",origin:"Anambra",residence:"Lagos",lga:"Awka South",lgaResidence:"Ikeja",role:"member",strikes:0,status:"active",posts:12,followers:34,following:21,bio:"Civic advocate from Anambra. Passionate about community development and government accountability.",title:"Civic Voice"},
  {id:"u2",username:"KanoTruth",name:"Musa Ibrahim",email:"musa@test.ng",origin:"Kano",residence:"Kano",lga:"Kano Municipal",lgaResidence:"Kano Municipal",role:"state_mod",strikes:0,status:"active",posts:48,followers:120,following:55,bio:"State moderator. Truth above all. Kano deserves better leadership.",title:"State Moderator",assignedStates:["Kano"]},
  {id:"u3",username:"PHCitizen",name:"Emeka Nwosu",email:"emeka@test.ng",origin:"Rivers",residence:"Rivers",lga:"Port Harcourt",lgaResidence:"Obio/Akpor",role:"admin",strikes:0,status:"active",posts:85,followers:300,following:40,bio:"Admin. Building Nigeria's civic space one conversation at a time.",title:"Administrator",assignedStates:["Rivers"]},
  {id:"u4",username:"LagosBabe",name:"Funke Adeyemi",email:"funke@test.ng",origin:"Oyo",residence:"Lagos",lga:"Ibadan North",lgaResidence:"Surulere",role:"member",strikes:0,status:"active",posts:6,followers:15,following:30,bio:"Tech enthusiast in Lagos. Originally from Ibadan.",title:"New Voice"},
];
const now = Date.now();
const ta = (ms) => {const m=Math.floor((now-ms)/60000);if(m<60)return `${m}m ago`;const h=Math.floor(m/60);if(h<24)return `${h}h ago`;return `${Math.floor(h/24)}d ago`};

const MP = [
  {id:"p1",author:MU[0],forum:"national",state:"Anambra",lga:"Awka South",category:"News",tag:"News",title:"FG Announces New Infrastructure Fund for South-East",body:"The Federal Government has announced a ₦500 billion infrastructure development fund targeting the South-East region. The fund will focus on road construction, bridge repairs, and industrial zone development across all five states.",poll:null,image:null,likes:45,dislikes:3,replies:12,views:230,time:ta(now-3600000),ts:now-3600000,isBreaking:true,isHot:true},
  {id:"p2",author:MU[1],forum:"state",state:"Kano",lga:null,category:"Community Issues",tag:"Community Issues",title:"Water Supply Crisis in Nassarawa LGA — Third Week Running",body:"Residents of Nassarawa Local Government Area are entering their third week without reliable water supply. The main pumping station has been down since March 15th.",poll:null,image:null,likes:89,dislikes:1,replies:34,views:450,time:ta(now-7200000),ts:now-7200000,isBreaking:false,isHot:true},
  {id:"p3",author:MU[2],forum:"lga",state:"Rivers",lga:"Port Harcourt",category:"Events",tag:"Events",title:"Community Clean-Up Drive — Port Harcourt LGA, April 12",body:"Join us for the quarterly community clean-up exercise. Meeting point is the Town Hall by 7am. Refreshments provided.",poll:null,image:null,likes:23,dislikes:0,replies:8,views:120,time:ta(now-14400000),ts:now-14400000,isBreaking:false,isHot:false},
  {id:"p4",author:MU[0],forum:"national",state:"Lagos",lga:"Ikeja",category:"Jobs",tag:"Jobs",title:"Lagos State Civil Service Recruitment — 2,000 Positions Open",body:"The Lagos State Government has announced a massive recruitment drive. Over 2,000 positions are available across various ministries. Applications open April 5th.",poll:null,image:null,likes:112,dislikes:5,replies:56,views:890,time:ta(now-28800000),ts:now-28800000,isBreaking:false,isHot:true},
  {id:"p5",author:MU[1],forum:"state",state:"Kano",lga:null,category:"News",tag:"News",title:"Kano State Approves Free Healthcare for Under-5 Children",body:"The Kano State Executive Council has approved free healthcare for all children under 5. Covers vaccinations, check-ups, malaria treatment, and emergency care.",poll:null,image:null,likes:67,dislikes:2,replies:19,views:340,time:ta(now-43200000),ts:now-43200000,isBreaking:true,isHot:false},
  {id:"p6",author:MU[2],forum:"lga",state:"Rivers",lga:"Obio/Akpor",category:"Community Dev",tag:"Community Dev",title:"New Market Complex Construction Begins in Rumuokoro",body:"Construction has commenced on the new Rumuokoro Market Complex. The ₦3.2 billion project will accommodate 5,000+ traders.",poll:null,image:null,likes:38,dislikes:1,replies:14,views:210,time:ta(now-57600000),ts:now-57600000,isBreaking:false,isHot:false},
  {id:"p7",author:MU[0],forum:"national",state:null,lga:null,category:"Mentorship",tag:"Mentorship",title:"Free Tech Mentorship Program for Nigerian Youth — Apply Now",body:"A coalition of Nigerian tech leaders is launching a free 6-month mentorship program covering software engineering, data science, and product management.",poll:{question:"Which track interests you most?",opts:["Software Engineering","Data Science","Product Management","UI/UX Design"],votes:[42,28,31,19],voted:{}},image:null,likes:203,dislikes:0,replies:78,views:1200,time:ta(now-72000000),ts:now-72000000,isBreaking:false,isHot:true},
];

const MR = {"p1":[
  {id:"r1",author:MU[1],content:"This is long overdue. The South-East has been neglected for decades.",time:ta(now-3000000),likes:12,dislikes:1,_edited:false},
  {id:"r2",author:MU[2],content:"__QUOTE__:KanoTruth:r1:This is long overdue. The South-East has been neglected.__ENDQUOTE__\n\nAgreed, but let's track the implementation closely.",time:ta(now-2400000),likes:8,dislikes:0,_edited:false},
  {id:"r3",author:MU[0],content:"The fund allocation committee includes representatives from all five South-East states. Good sign for accountability.",time:ta(now-1800000),likes:15,dislikes:0,_edited:true},
]};

const MOCK_MSGS = [
  {id:"m1",sender:MU[1],receiver:MU[0],subject:"Welcome to NairaClan!",body:"Hi NairaBoss, glad to be here! Feel free to reach out if you need any help navigating the platform.",isRead:false,time:ta(now-86400000)},
  {id:"m2",sender:MU[2],receiver:MU[0],subject:"Community Clean-Up Details",body:"Hey, just wanted to share the full schedule for the upcoming clean-up drive. We'll be starting from the market area.",isRead:false,time:ta(now-172800000)},
  {id:"m3",sender:MU[0],receiver:MU[1],subject:"Re: Moderation Question",body:"Thanks for clarifying the guidelines on political posts. I'll make sure to keep things factual.",isRead:true,time:ta(now-259200000)},
  {id:"m4",sender:MU[0],receiver:MU[2],subject:"Kano State Report",body:"The water supply situation in Nassarawa has been flagged multiple times. Can you coordinate with local reps?",isRead:false,time:ta(now-120000000)},
  {id:"m5",sender:MU[3],receiver:MU[1],subject:"Accountability Forum Idea",body:"I was thinking we could organize a monthly accountability forum for our LGA. Would you support this?",isRead:false,time:ta(now-150000000)},
  {id:"m6",sender:MU[2],receiver:MU[1],subject:"Moderation Help Needed",body:"We have some posts in the Kano forum that need review. Can you take a look when you get a chance?",isRead:false,time:ta(now-200000000)},
  {id:"m7",sender:MU[1],receiver:MU[2],subject:"Re: Kano Forum Posts",body:"I've reviewed them. Two were spam and have been flagged. The rest are fine.",isRead:true,time:ta(now-190000000)},
  {id:"m8",sender:MU[0],receiver:MU[3],subject:"Welcome Admin Note",body:"Welcome to NairaClan! As admin, you have access to the dashboard. Let me know if you need a walkthrough.",isRead:false,time:ta(now-100000000)},
  {id:"m9",sender:MU[4],receiver:MU[3],subject:"Lagos Events",body:"There's a town hall meeting next week at Ikeja LGA. Should we post about it on the forum?",isRead:false,time:ta(now-80000000)},
  {id:"m10",sender:MU[3],receiver:MU[4],subject:"Re: Lagos Events",body:"Great idea! Go ahead and create a post under the Events category. I'll pin it if it gets traction.",isRead:true,time:ta(now-75000000)},
];

const MOCK_NOTIFS = [
  {id:"n1",type:"reply",title:"KanoTruth replied to your post",body:"\"This is long overdue…\"",linkView:"thread",linkExtra:{postId:"p1"},isRead:false,time:ta(now-3000000)},
  {id:"n2",type:"like",title:"PHCitizen liked your post",body:"FG Announces New Infrastructure Fund",linkView:"thread",linkExtra:{postId:"p1"},isRead:false,time:ta(now-5000000)},
  {id:"n3",type:"follow",title:"LagosBabe started following you",body:null,linkView:"profile",linkExtra:{userId:"u4"},isRead:true,time:ta(now-100000000)},
];

/* ═══════════════════════════════════════════ LEADERS DATA ═══════════════════════════════════════════ */
const GOV_DUTIES=["Chief Executive of the State — sets policy direction and governance priorities","Appoints Commissioners, Special Advisers, and heads of state agencies and parastatals","Presents the state budget (Appropriation Bill) to the State House of Assembly","Chairs the State Executive Council (cabinet) and the State Security Council","Signs state bills into law or withholds assent","Declares state of emergency and coordinates security operations within the state","Oversees management of state revenue, FAAC allocations, and internally generated funds","Represents the state in dealings with the Federal Government, other states, and international partners"];
const DEP_DUTIES=["Acts as Governor when the Governor is absent from the state or incapacitated","Chairs committees and task forces delegated by the Governor","Oversees specific state programmes and policy areas assigned by the Governor","Participates in State Executive Council meetings and contributes to policy decisions","Serves as liaison between the Governor and local government chairmen","Represents the state at inter-governmental and national events when delegated"];
const CHR_DUTIES=["Chief Executive of the LGA — oversees all local governance and administration","Presides over LGA Council meetings and sets local policy agenda","Manages the LGA's share of FAAC allocations and internally generated revenue","Oversees primary healthcare centres (PHCs) within the LGA","Manages local primary education — school infrastructure and staffing","Coordinates waste collection, sanitation, and environmental health","Maintains local roads, drainage systems, and community infrastructure","Issues permits, collects local rates, and manages market operations","Coordinates with the State Government and traditional rulers on community matters","Ensures local security through cooperation with police and community leaders"];
const VCH_DUTIES=["Acts as Chairman in the Chairman's absence or incapacity","Chairs assigned LGA committees and community liaison meetings","Oversees women and youth development programmes","Supports coordination of community development projects","Represents the LGA at inter-governmental and community events when delegated"];
const G=(id,name,dep,party,state)=>([{id:id+"a",name,title:"Governor of "+state+" State",party,state,bio:"",duties:GOV_DUTIES},{id:id+"b",name:dep,title:"Deputy Governor of "+state+" State",party,state,bio:"",duties:DEP_DUTIES}]);

const LEADERS = {
  federal:[
    {id:"lf1",name:"Bola Ahmed Tinubu",title:"President of Nigeria",party:"APC",state:"Lagos",
      bio:"Bola Ahmed Tinubu is the 16th President of the Federal Republic of Nigeria, inaugurated on 29 May 2023. A former Governor of Lagos State (1999–2007), he is widely regarded as a key political figure who shaped modern Lagos into an economic hub. His administration's priorities include economic reform, security, and infrastructure development.",
      duties:["Serves as Commander-in-Chief of the Armed Forces of Nigeria","Appoints Ministers, Ambassadors, and heads of Federal Government agencies","Signs or vetoes bills passed by the National Assembly into law","Proposes the annual national budget and presents it to the legislature","Represents Nigeria in international diplomacy, treaties, and foreign affairs","Declares a state of emergency in any part of the federation when necessary","Chairs the Federal Executive Council (cabinet meetings)","Coordinates and directs the operations of all federal ministries"]},
    {id:"lf2",name:"Kashim Shettima",title:"Vice President of Nigeria",party:"APC",state:"Borno",
      bio:"Senator Kashim Shettima served as Governor of Borno State from 2011 to 2019, leading the state through the height of the Boko Haram insurgency. As Vice President, he chairs the National Economic Council and oversees key policy portfolios.",
      duties:["Acts as President whenever the President is absent from Nigeria or incapacitated","Chairs the National Economic Council (NEC) which coordinates economic planning across states","Presides over the Federal Executive Council in the President's absence","Oversees specific policy portfolios and initiatives delegated by the President","Serves as a key liaison between the Presidency and the National Assembly","Advises the President on matters of national importance","Coordinates inter-governmental relations between federal and state governments"]},
  ],
  stateLeaders:{
    "Abia":G("ab","Alex Otti","Ikechukwu Emetu","LP","Abia"),
    "Adamawa":G("ad","Ahmadu Umaru Fintiri","Kaletapwa Farauta","APC","Adamawa"),
    "Akwa Ibom":G("ak","Umo Eno","Akon Eyakenyi","APC","Akwa Ibom"),
    "Anambra":G("an","Charles Soludo","Onyeka Ibezim","APGA","Anambra"),
    "Bauchi":G("ba","Bala Muhammed","Auwal Jatau","PDP","Bauchi"),
    "Bayelsa":G("by","Douye Diri","Peter Akpe","APC","Bayelsa"),
    "Benue":G("bn","Hyacinth Alia","Samuel Ode","APC","Benue"),
    "Borno":G("bo","Babagana Zulum","Umar Usman Kadafur","APC","Borno"),
    "Cross River":G("cr","Bassey Otu","Peter Odey","APC","Cross River"),
    "Delta":G("dl","Sheriff Oborevwori","Monday Onyeme","APC","Delta"),
    "Ebonyi":G("eb","Francis Nwifuru","Patricia Obila","APC","Ebonyi"),
    "Edo":G("ed","Monday Okpebholo","Dennis Idahosa","APC","Edo"),
    "Ekiti":G("ek","Biodun Oyebanji","Monisade Afuye","APC","Ekiti"),
    "Enugu":G("en","Peter Mbah","Ifeanyi Ossai","APC","Enugu"),
    "Gombe":G("go","Muhammad Inuwa Yahaya","Manasseh Daniel Jatau","APC","Gombe"),
    "Imo":G("im","Hope Uzodinma","Chinyere Ekomaru","APC","Imo"),
    "Jigawa":G("ji","Umar Namadi","Aminu Usman","APC","Jigawa"),
    "Kaduna":G("kd","Uba Sani","Hadiza Balarabe","APC","Kaduna"),
    "Kano":G("kn","Abba Kabir Yusuf","Aminu Abdussalam Gwarzo","APC","Kano"),
    "Katsina":G("kt","Dikko Umaru Radda","Faruk Lawal Jobe","APC","Katsina"),
    "Kebbi":G("kb","Nasir Idris","Abubakar Umar Argungu","APC","Kebbi"),
    "Kogi":G("kg","Ahmed Usman Ododo","Salifu Joel","APC","Kogi"),
    "Kwara":G("kw","AbdulRahman AbdulRazaq","Kayode Alabi","APC","Kwara"),
    "Lagos":G("lg","Babajide Sanwo-Olu","Femi Hamzat","APC","Lagos"),
    "Nasarawa":G("ns","Abdullahi Sule","Emmanuel Akabe","APC","Nasarawa"),
    "Niger":G("ng","Mohammed Umar Bago","Yakubu Garba","APC","Niger"),
    "Ogun":G("og","Dapo Abiodun","Noimot Salako-Oyedele","APC","Ogun"),
    "Ondo":G("on","Lucky Aiyedatiwa","Olayide Adelami","APC","Ondo"),
    "Osun":G("os","Ademola Adeleke","Kola Adewusi","Accord","Osun"),
    "Oyo":G("oy","Seyi Makinde","Bayo Lawal","PDP","Oyo"),
    "Plateau":G("pl","Caleb Mutfwang","Josephine Piyo","APC","Plateau"),
    "Rivers":G("rv","Siminalayi Fubara","Ngozi Odu","APC","Rivers"),
    "Sokoto":G("sk","Ahmad Aliyu","Idris Muhammad Gobir","APC","Sokoto"),
    "Taraba":G("tr","Agbu Kefas","Aminu Abdullahi Alkali","APC","Taraba"),
    "Yobe":G("yb","Mai Mala Buni","Idi Barde Gubana","APC","Yobe"),
    "Zamfara":G("zm","Dauda Lawal","Mani Mallam Mummuni","PDP","Zamfara"),
    "FCT":[{id:"fct1",name:"Nyesom Wike",title:"Minister of FCT",party:"APC",state:"FCT",bio:"Nyesom Wike is the Minister of the Federal Capital Territory, appointed in 2023. He previously served as Governor of Rivers State from 2015 to 2023.",duties:["Oversees the administration and development of Abuja and the FCT","Manages land allocation, urban planning, and infrastructure development in the FCT","Coordinates security operations within the Federal Capital Territory","Supervises FCT area councils and satellite towns","Implements federal policies on housing, transportation, and public works","Reports directly to the President on FCT matters"]},{id:"fct2",name:"Mariya Mahmoud Bunkure",title:"Minister of State for FCT",party:"APC",state:"FCT",bio:"Mariya Mahmoud Bunkure serves as Minister of State for the FCT, supporting the FCT Minister.",duties:["Supports the FCT Minister in administration and policy implementation","Oversees assigned FCT agencies and programmes","Coordinates social development and community engagement initiatives"]}],
  },
  lgaLeaders:{
    "Port Harcourt":[
      {id:"lc1",name:"Hon. Ihunwo Chijioke Iheanyi",title:"Chairman, Port Harcourt City LGA",party:"PDP",state:"Rivers",lga:"Port Harcourt",bio:"Hon. Ihunwo Chijioke Iheanyi serves as the elected Chairman of Port Harcourt City Local Government Area, overseeing Nigeria's major oil and gas hub.",duties:CHR_DUTIES},
      {id:"lc2",name:"Hon. Maureen Tamuno",title:"Vice Chairman, Port Harcourt City LGA",party:"PDP",state:"Rivers",lga:"Port Harcourt",bio:"Hon. Maureen Tamuno serves as the Vice Chairman of Port Harcourt City LGA.",duties:VCH_DUTIES},
    ],
    "Obio/Akpor":[
      {id:"lc3",name:"Hon. George Ariolu",title:"Chairman, Obio/Akpor LGA",party:"PDP",state:"Rivers",lga:"Obio/Akpor",bio:"Hon. George Ariolu serves as Chairman of Obio/Akpor LGA, one of the most urbanised local governments in Rivers State.",duties:CHR_DUTIES},
      {id:"lc4",name:"Hon. Blessing Wosu",title:"Vice Chairman, Obio/Akpor LGA",party:"PDP",state:"Rivers",lga:"Obio/Akpor",bio:"Hon. Blessing Wosu serves as Vice Chairman of Obio/Akpor LGA.",duties:VCH_DUTIES},
    ],
    "Kano Municipal":[
      {id:"lc5",name:"Hon. Fa'izu Muhammad",title:"Chairman, Kano Municipal LGA",party:"NNPP",state:"Kano",lga:"Kano Municipal",bio:"Hon. Fa'izu Muhammad is the Chairman of Kano Municipal Local Government Area, the administrative heart of Kano State.",duties:CHR_DUTIES},
      {id:"lc6",name:"Hon. Aisha Bello",title:"Vice Chairman, Kano Municipal LGA",party:"NNPP",state:"Kano",lga:"Kano Municipal",bio:"Hon. Aisha Bello serves as Vice Chairman of Kano Municipal LGA.",duties:VCH_DUTIES},
    ],
    "Awka South":[
      {id:"lc7",name:"Hon. Chukwuemeka Obi",title:"Chairman, Awka South LGA",party:"APGA",state:"Anambra",lga:"Awka South",bio:"Hon. Chukwuemeka Obi is the Chairman of Awka South LGA, which houses Awka, the capital of Anambra State.",duties:CHR_DUTIES},
      {id:"lc8",name:"Hon. Ngozi Eze",title:"Vice Chairman, Awka South LGA",party:"APGA",state:"Anambra",lga:"Awka South",bio:"Hon. Ngozi Eze is the Vice Chairman of Awka South LGA.",duties:VCH_DUTIES},
    ],
    "Ikeja":[
      {id:"lc9",name:"Hon. Adebayo Adesanya",title:"Chairman, Ikeja LGA",party:"APC",state:"Lagos",lga:"Ikeja",bio:"Hon. Adebayo Adesanya is the Chairman of Ikeja Local Government Area, the administrative capital of Lagos State.",duties:CHR_DUTIES},
      {id:"lc10",name:"Hon. Funke Adekoya",title:"Vice Chairman, Ikeja LGA",party:"APC",state:"Lagos",lga:"Ikeja",bio:"Hon. Funke Adekoya serves as Vice Chairman of Ikeja LGA.",duties:VCH_DUTIES},
    ],
    "Ibadan North":[
      {id:"lc11",name:"Hon. Ademola Ojo",title:"Chairman, Ibadan North LGA",party:"PDP",state:"Oyo",lga:"Ibadan North",bio:"Hon. Ademola Ojo serves as Chairman of Ibadan North LGA in Oyo State.",duties:CHR_DUTIES},
      {id:"lc12",name:"Hon. Folake Akinwale",title:"Vice Chairman, Ibadan North LGA",party:"PDP",state:"Oyo",lga:"Ibadan North",bio:"Hon. Folake Akinwale is the Vice Chairman of Ibadan North LGA.",duties:VCH_DUTIES},
    ],
  }
};

/* ═══════════════════════════════════════════ GUIDELINES DATA ═══════════════════════════════════════════ */
const GUIDELINES_DATA = {
  sections:[
    {title:"Civic Standards",icon:"🏛️",rules:[
      {num:1,text:"Discuss governance, policies, and public affairs with facts and evidence."},
      {num:2,text:"Political criticism is encouraged — criticise policies, not ethnicities."},
      {num:3,text:"Cite sources when sharing news. Unverified claims must be clearly labelled."},
      {num:4,text:"Keep discussions relevant to your forum's geographic scope (LGA, State, or National)."},
      {num:5,text:"Respect elected officials' humanity while holding them accountable."}
    ]},
    {title:"Community Conduct",icon:"🤝",rules:[
      {num:6,text:"No ethnic hate speech, tribal attacks, or religious discrimination."},
      {num:7,text:"No threats of violence, doxxing, or harassment of any kind."},
      {num:8,text:"No scams, MLM schemes, advance-fee fraud, or deceptive promotions."},
      {num:9,text:"No explicit, pornographic, or gratuitously violent content."},
      {num:10,text:"Phone numbers are only allowed in 'For Sale' posts and private Inbox messages."},
      {num:11,text:"Do not impersonate other users, public officials, or organisations."},
      {num:12,text:"Avoid ALL CAPS shouting and spam/repetitive posting."}
    ]},
    {title:"Authenticity & Safety",icon:"🛡️",rules:[
      {num:13,text:"One account per person. Multiple accounts will be merged or banned."},
      {num:14,text:"Report content that violates these guidelines — do not engage trolls."},
      {num:15,text:"Protect your privacy and the privacy of others. No sharing of personal data without consent."}
    ]}
  ],
  strikes:{title:"Strike System",items:[
    {level:1,label:"First Strike — Warning",desc:"You receive a formal warning. The offending content is removed. Educational guidance provided."},
    {level:2,label:"Second Strike — Restriction",desc:"Posting privileges temporarily restricted for 48 hours. Continued violations will lead to suspension."},
    {level:3,label:"Third Strike — Suspension",desc:"Account automatically suspended. You cannot post, reply, or message other users."}
  ]},
  appeals:"If you believe a strike was issued in error, you may submit an appeal via the Inbox by messaging any Admin or Super Admin within 7 days. Appeals are reviewed within 48 hours."
};

/* ═══════════════════════════════════════════ AD BANNERS MOCK ═══════════════════════════════════════════ */
const MOCK_ADS = [
  {id:"ad1",scopes:["national"],imgUrl:"",title:"MTN Nigeria — Connect Better",linkUrl:"https://mtn.ng",status:"active",endDate:Date.now()+86400000*14},
  {id:"ad2",scopes:["state_Lagos","state_Ogun","state_Oyo"],imgUrl:"",title:"Lagos State Tourism Board",linkUrl:"#",status:"active",endDate:Date.now()+86400000*7},
  {id:"ad3",scopes:["lga_Port Harcourt","lga_Obio/Akpor"],imgUrl:"",title:"PHC Clean City Initiative",linkUrl:"#",status:"active",endDate:Date.now()+86400000*30},
];

const MOCK_REPORTS = [
  {id:"rp1",postId:"p2",postTitle:"Water Supply Crisis in Nassarawa LGA",author:"KanoTruth",reportedBy:"ChiefAda",reason:"Misinformation",detail:"Claims are unverified",severity:"medium",status:"pending",count:2,time:ta(now-50000000)},
  {id:"rp2",postId:"p6",postTitle:"New Market Complex Construction",author:"PHCitizen",reportedBy:"LagosBabe",reason:"Spam",detail:"Promotional content",severity:"low",status:"pending",count:1,time:ta(now-80000000)},
];

const MOCK_TEAM = [
  {id:"tm1",userId:"u2",username:"KanoTruth",role:"state_mod",assignedStates:["Kano"],assignedLgas:[]},
  {id:"tm2",userId:"u3",username:"PHCitizen",role:"admin",assignedStates:["Rivers"],assignedLgas:[]},
];

const MOCK_LOG = [
  {id:"al1",actor:"PHCitizen",action:"Promoted user",detail:"KanoTruth → state_mod for Kano",time:ta(now-200000000)},
  {id:"al2",actor:"PHCitizen",action:"Activated ad",detail:"MTN Nigeria banner (national scope)",time:ta(now-300000000)},
  {id:"al3",actor:"PHCitizen",action:"Issued strike",detail:"Strike 1 to user TestUser for ethnic hate speech",time:ta(now-400000000)},
  {id:"al4",actor:"System",action:"Auto-suspended",detail:"User TestUser reached 3 strikes",time:ta(now-400100000)},
];

/* ═══════════════════════════════════════════ CIVIC EDU ═══════════════════════════════════════════ */
const CIVIC = {
  national:[
    {id:"nf1",title:"What is FAAC?",body:"The Federation Account Allocation Committee distributes revenue among federal, state, and local governments monthly.",cta:"Learn how your LGA's share is calculated →",detail:"The Federation Account Allocation Committee (FAAC) meets monthly to distribute revenue collected by the Federal Government among the three tiers of government. Revenue sources include oil and gas proceeds, VAT, customs duties, and company income tax. The sharing formula allocates 52.68% to Federal, 26.72% to States, and 20.60% to LGAs. You can track monthly FAAC disbursements through the Federal Ministry of Finance."},
    {id:"nf2",title:"Your Right to Information",body:"The FOI Act gives every Nigerian the right to access public records from any government institution.",cta:"Know how to file an FOI request →",detail:"The Freedom of Information Act (2011) allows any person to request information held by a public institution without giving a reason. The institution must respond within 7 days. You can request government contracts, budgets, staff lists, and official correspondence. Write to the head of the institution. Civil society organisations like Media Rights Agenda provide free templates."},
    {id:"nf3",title:"How Laws Are Made",body:"Bills pass through both the Senate and House of Representatives before the President signs them into law.",cta:"Understand the legislative process →",detail:"A bill goes through first reading, committee examination, second reading (clause-by-clause debate), and third reading in both chambers. If versions differ, a Conference Committee harmonises them. The President has 30 days to sign or veto. The National Assembly can override a veto with two-thirds majority. You can participate by attending public hearings and contacting your representatives."},
    {id:"nf4",title:"Voting is Your Power",body:"Every registered Nigerian aged 18+ can vote. Your PVC is your voice in choosing who leads you.",cta:"Check your registration status →",detail:"Register with INEC and collect your PVC. On election day, go to your polling unit with your PVC. The BVAS system verifies your identity. Nigeria elects Presidents, Senators, House members, Governors, and State Assembly members. Many elections are decided by thin margins — your vote counts."},
    {id:"nf5",title:"The Role of INEC",body:"The Independent National Electoral Commission organises all elections and registers voters nationwide.",cta:"Find your polling unit →",detail:"INEC maintains the voter register, delineates constituencies, registers parties, organises elections, and announces results. It operates through 36 state offices, 774 LGA offices, and 176,000+ polling units. Reforms include BVAS for accreditation and IReV for result transmission. Verify your status at inecnigeria.org."},
    {id:"nf6",title:"National Assembly",body:"Nigeria's legislature consists of a 109-member Senate and a 360-member House of Representatives.",cta:"Know your representatives →",detail:"The Senate has 109 members (3 per state + 1 FCT). The House has 360 members from single-member constituencies. The Senate confirms appointments and approves budgets. The House has power of the purse. Both have standing committees that oversee ministries. Your representatives work for you — hold them accountable."},
    {id:"nf7",title:"The Judiciary Explained",body:"Nigeria's courts interpret laws and settle disputes. The Supreme Court is the highest court of appeal.",cta:"Know your legal rights →",detail:"The judicial hierarchy runs from Magistrate Courts to High Courts, Court of Appeal, and the Supreme Court. The Chief Justice of Nigeria heads the judiciary. Specialised courts include the Federal High Court (revenue, admiralty, intellectual property), National Industrial Court (labour disputes), and Sharia/Customary Appeal Courts. Every citizen has the right to fair hearing within a reasonable time. You can challenge unconstitutional actions through Fundamental Rights Enforcement proceedings."},
    {id:"nf8",title:"What is the EFCC?",body:"The Economic and Financial Crimes Commission investigates and prosecutes corruption and financial crimes.",cta:"Report corruption →",detail:"The EFCC was established in 2003 to combat advance fee fraud, money laundering, counterfeiting, illegal fund transfers, and corruption. It has powers to investigate, seize assets, and prosecute. The ICPC (Independent Corrupt Practices Commission) focuses specifically on corruption in public institutions. You can report financial crimes anonymously through the EFCC website (efcc.ng) or visit any state office. Both agencies operate whistleblower protection programmes."},
    {id:"nf9",title:"Nigeria's Constitution",body:"The 1999 Constitution is the supreme law. Any law inconsistent with it is void to the extent of the inconsistency.",cta:"Know your rights →",detail:"The 1999 Constitution is Nigeria's supreme law — any law inconsistent with it is void. Chapter II outlines fundamental objectives (social, economic, political) while Chapter IV guarantees enforceable fundamental rights including: right to life, dignity, personal liberty, fair hearing, privacy, freedom of thought/religion/expression/assembly/movement, and freedom from discrimination. Constitutional amendments require two-thirds of both National Assembly chambers plus approval by 24 state assemblies."},
    {id:"nf10",title:"Federal Ministries",body:"The President appoints Ministers from each state who oversee specific sectors like health, education, and works.",cta:"Know who leads each sector →",detail:"Nigeria has over 20 federal ministries including Finance, Health, Education, Works, Agriculture, Defence, Justice, Interior, and Foreign Affairs. Each ministry is headed by a Minister appointed by the President (at least one from each state) and confirmed by the Senate. Permanent Secretaries provide administrative continuity. Ministries develop policies, manage budgets, and oversee agencies. You can find contact details and organisational charts on each ministry's website."},
    {id:"nf11",title:"National Budget Process",body:"The Federal Government presents an annual budget to the National Assembly for debate, amendment, and passage.",cta:"Track budget implementation →",detail:"The budget cycle involves: Medium-Term Expenditure Framework preparation, Budget Call Circular to ministries, Executive budget proposal (usually Oct-Dec), National Assembly debate and amendment, Presidential assent, and implementation. Citizens can participate through public hearings, BudgIT's budget tracking platform, and the Open Treasury Portal (opentreasury.gov.ng). Budget implementation rates rarely exceed 60%. The Fiscal Responsibility Commission monitors compliance."},
    {id:"nf12",title:"Public Procurement Act",body:"All government purchases above ₦2.5 million must follow competitive bidding rules to prevent corruption.",cta:"Learn procurement rules →",detail:"The Bureau of Public Procurement (BPP) regulates all federal government procurement. Contracts above ₦2.5M for goods, ₦5M for works, and ₦2.5M for services require competitive bidding. The BPP publishes contract awards on its website. A National Council on Public Procurement oversees the bureau. Citizens can report procurement fraud to the BPP, EFCC, or use the whistle-blower policy for financial rewards. All government procurement plans must be published annually."},
    {id:"nf13",title:"Revenue Mobilisation",body:"The Revenue Mobilisation Allocation and Fiscal Commission determines how national revenue is shared.",cta:"Understand revenue sharing →",detail:"RMAFC is established by Section 153 of the Constitution. It reviews the revenue allocation formula periodically, determines remuneration for all political, public, and judicial office holders, and monitors FAAC operations. The current formula gives the Federal Government 52.68%, States 26.72%, and LGAs 20.60%. The derivation principle allocates 13% of natural resource revenue to producing states. Reform proposals frequently debate increasing state and LGA shares."},
    {id:"nf14",title:"Press Freedom",body:"Section 39 of the Constitution guarantees freedom of expression and press freedom for all Nigerians.",cta:"Protect media rights →",detail:"Section 39 guarantees every Nigerian the right to freedom of expression including freedom to hold opinions, receive and impart ideas. The press has specific protections. However, the Cybercrimes Act 2015, Official Secrets Act, and various state laws can restrict press freedom. Nigeria ranks low on global press freedom indices. Report attacks on journalists to the Nigeria Union of Journalists, Committee to Protect Journalists, or Reporters Without Borders."},
    {id:"nf15",title:"NHRC: Your Rights Defender",body:"The National Human Rights Commission investigates complaints about human rights violations.",cta:"File a complaint →",detail:"The NHRC was established by the National Human Rights Commission Act 1995 (amended 2010). It investigates human rights violations by government agencies, security forces, and private individuals. Complaints are free to file at any NHRC office across all 36 states and FCT. The commission can summon witnesses, recommend compensation, refer cases for prosecution, and conduct public inquiries. Common complaints include unlawful detention, extrajudicial killings, torture, and property destruction."},
    {id:"nf16",title:"Anti-Corruption Agencies",body:"Nigeria has multiple agencies fighting corruption: EFCC, ICPC, Code of Conduct Bureau, and the Auditor-General.",cta:"Report to the right agency →",detail:"Nigeria's anti-corruption framework includes: EFCC (financial crimes), ICPC (public sector corruption), Code of Conduct Bureau (asset declarations of public officers), Code of Conduct Tribunal (tries violations), Auditor-General (government accounts audit), Public Complaints Commission (maladministration), and the Nigeria Extractive Industries Transparency Initiative (oil sector). Each has specific jurisdiction — knowing which to approach saves time when reporting corruption."},
    {id:"nf17",title:"Fiscal Responsibility",body:"The Fiscal Responsibility Act requires transparency in government finances and limits on borrowing.",cta:"Demand accountability →",detail:"The Fiscal Responsibility Act 2007 requires all tiers of government to prepare Medium-Term Expenditure Frameworks, publish quarterly budget implementation reports, limit borrowing to sustainable levels, and establish sinking funds for debt repayment. The Fiscal Responsibility Commission monitors compliance and can sanction violations. Citizens can request fiscal reports under the FOI Act and challenge irresponsible spending through the commission."},
    {id:"nf18",title:"Whistleblower Policy",body:"The Federal Government's whistleblower policy rewards Nigerians who report corruption with up to 5% of recovered funds.",cta:"Learn how to report →",detail:"The Federal Ministry of Finance Whistle-Blower Policy (2016) rewards citizens who provide credible information about fraud, stolen public funds, tax evasion, financial misconduct, or violation of financial regulations. Rewards range from 2.5% to 5% of recovered funds. Reports can be submitted via email, phone, or the ministry's online portal. The Whistle-Blower Protection Bill seeks to provide legal immunity from retaliation."},
    {id:"nf19",title:"Police Reform",body:"The Nigeria Police Force is undergoing reform including community policing, better training, and accountability.",cta:"Know your police rights →",detail:"The Nigeria Police Force has approximately 370,000 officers for 200+ million people — one of the lowest police-to-citizen ratios globally. Ongoing reforms include community policing initiatives, the Police Trust Fund for equipment, and oversight by the Police Service Commission. Citizens' rights during police encounters: you cannot be detained beyond 24-48 hours without court arraignment; bail for bailable offences is free; you have the right to a lawyer; excessive force is illegal."},
    {id:"nf20",title:"National Development Plan",body:"Nigeria's NDP 2021-2025 outlines economic diversification, infrastructure, and human capital development goals.",cta:"Track development progress →",detail:"The NDP 2021-2025 targets 5% annual GDP growth, creation of 21.2 million jobs, poverty reduction from 40% to 30%, and significant infrastructure investment. Priority sectors include agriculture, manufacturing, digital economy, solid minerals, and energy. Implementation is coordinated by the Ministry of Finance, Budget and National Planning. Progress reports are published quarterly. Successor plans continue the diversification and infrastructure agenda."},
    {id:"nf21",title:"National Health Act",body:"The NHA establishes a Basic Health Care Provision Fund ensuring minimum health services for all Nigerians.",cta:"Know your health rights →",detail:"The National Health Act 2014 established the Basic Health Care Provision Fund (BHCPF) — at least 1% of the federal budget plus donor contributions. The fund covers: 50% for primary healthcare through NPHCDA, 45% for the National Health Insurance Authority, and 5% for health emergencies. Every Nigerian is entitled to a minimum package of essential health services at PHCs. Report facility failures to the NPHCDA hotline or your state Primary Health Care Board."},
    {id:"nf22",title:"Electoral Act 2022",body:"The amended Electoral Act introduced electronic voting, BVAS accreditation, and early election result transmission.",cta:"Know election rules →",detail:"Key Electoral Act 2022 provisions: INEC must use technology for voter accreditation (BVAS) and electronic transmission of results (IReV); political parties must conduct monitored primaries; campaign expense limits are set by law; vote buying and electoral violence carry imprisonment; results must be displayed at polling units and uploaded electronically; the presidential election requires simple majority plus 25% in two-thirds of states."},
    {id:"nf23",title:"Federal Character Principle",body:"Government appointments and admissions must reflect Nigeria's diversity across states and ethnic groups.",cta:"Understand the principle →",detail:"The Federal Character Commission ensures no state, ethnic group, or section dominates federal institutions. It applies to: civil service recruitment, military and police intake, federal university admissions, and appointments to boards and agencies. Each state should have roughly proportional representation. The commission publishes compliance reports and can sanction violating institutions. Critics argue it sometimes prioritises geography over merit."},
    {id:"nf24",title:"Petroleum Industry Act",body:"The PIA 2021 restructured Nigeria's oil and gas industry and created the Host Community Development Fund.",cta:"What it means for communities →",detail:"The PIA 2021 was the most significant oil sector reform in decades. It created NUPRC (upstream regulation) and NMDPRA (midstream/downstream), replaced NNPC with NNPC Ltd (a commercial entity), established the Host Community Development Trust (3% of operator expenses), and set aside 30% of NNPC profits for frontier exploration. Host communities should establish development trusts and participate in how funds are spent."},
    {id:"nf25",title:"UBE Act: Free Education",body:"The Universal Basic Education Act guarantees free, compulsory education from primary through junior secondary.",cta:"Report denied access →",detail:"The UBE Act 2004 makes basic education (6 years primary + 3 years junior secondary) free and compulsory. The Universal Basic Education Commission receives 2% of the Consolidated Revenue Fund. States access matching grants through State Universal Basic Education Boards (SUBEBs). No child can be denied admission for inability to pay. Schools cannot charge fees for basic education. Parents who fail to enroll children face prosecution. Report violations to UBEC or your state SUBEB."},
    {id:"nf26",title:"Consumer Protection",body:"The Federal Competition and Consumer Protection Commission protects Nigerians from unfair business practices.",cta:"File a consumer complaint →",detail:"FCCPC (formerly Consumer Protection Council) handles complaints about: defective products, misleading advertising, unfair pricing, anti-competitive behaviour, and data protection violations. File complaints online at fccpc.gov.ng, call the helpline, or visit state offices. The commission can investigate, order recalls, impose fines up to ₦10M, and prosecute. Your consumer rights include: right to safety, information, choice, redress, and consumer education."},
    {id:"nf27",title:"Diaspora Voting",body:"The Electoral Act provisions for diaspora voting are being developed to allow Nigerians abroad to vote.",cta:"Stay informed →",detail:"The Electoral Act 2022 contains framework provisions for diaspora voting. INEC is developing implementation modalities covering: registration of eligible Nigerians abroad, voting methods (in-person at embassies or electronic), result collation, and security. An estimated 17 million Nigerians live in the diaspora. Stay updated through INEC (inecnigeria.org) and the Nigerians in Diaspora Commission (nidcom.gov.ng)."},
    {id:"nf28",title:"Gender & Governance",body:"Women make up 49% of Nigeria's population but hold less than 10% of elected positions.",cta:"Support inclusion →",detail:"Women hold less than 7% of National Assembly seats, about 4% of governorship positions, and roughly 12% of state assembly seats. The National Gender Policy recommends 35% affirmative action for women in all appointed and elected positions. Barriers include cultural norms, political violence, inadequate financing, and party gatekeeping. The Gender and Equal Opportunities Bill has been introduced multiple times but not yet passed."},
    {id:"nf29",title:"Climate Change Act",body:"Nigeria's Climate Change Act 2021 sets targets for net-zero emissions by 2060 and a National Climate Council.",cta:"Environmental responsibility →",detail:"The Climate Change Act 2021 established the National Council on Climate Change chaired by the President. Nigeria committed to 20% unconditional emissions reduction by 2030 (47% with international support) and net-zero by 2060. Priority actions: transition to renewable energy, end gas flaring by 2030, protect forests, climate-smart agriculture, and climate-resilient infrastructure. NESREA enforces environmental standards. Citizens can report violations."},
    {id:"nf30",title:"Digital Economy",body:"Nigeria's digital economy policy aims to leverage technology for economic growth, job creation, and governance.",cta:"Join the digital economy →",detail:"The National Digital Economy Policy covers: digital infrastructure (broadband for 70% of Nigerians), digital identity (NIN for all citizens), digital literacy (training 95% of civil servants), e-government (digital-first service delivery), digital innovation (startup ecosystem support), and emerging technologies (AI, blockchain, IoT). The Nigeria Startup Act 2022 provides tax breaks, funding access, and regulatory sandboxes for tech startups. Citizens should obtain their NIN and use e-government portals."}
  ],
  state:[
    {id:"sf1",title:"Governor's Powers",body:"Governors control state budgets, appoint commissioners, and can declare emergencies within their states.",cta:"Track your governor →",detail:"The Governor appoints Commissioners, Special Advisers, and Permanent Secretaries. All Commissioner appointments need House of Assembly confirmation. The Governor presents the annual budget, chairs the State Executive Council and State Security Council, and can be impeached for gross misconduct."},
    {id:"sf2",title:"State House of Assembly",body:"Each state has a House of Assembly that makes laws, approves the budget, and oversees the executive.",cta:"Know your legislator →",detail:"The House approves the state budget, confirms appointments, exercises oversight, and can impeach the Governor. Members represent single-member constituencies. You can attend sessions (they're public), submit petitions through your member, and participate in public hearings on bills."},
    {id:"sf3",title:"State Judiciary",body:"The state High Court handles civil and criminal cases. The Chief Judge heads the state judiciary.",cta:"Your legal rights →",detail:"State courts include High Court, Magistrate Courts, Customary Courts, and Sharia Courts (in northern states). You cannot be detained more than 48 hours without a court appearance. Legal Aid Council provides free legal services for qualifying cases. You have the right to legal representation and are presumed innocent until proven guilty."},
    {id:"sf4",title:"State Budgets",body:"The governor presents an appropriation bill to the House of Assembly, which debates, amends, and passes it.",cta:"Track your state budget →",detail:"State revenue comes from FAAC allocations, internally generated revenue, and loans/grants. Budget implementation rarely exceeds 60%. You can attend public hearings, submit memoranda on priorities, and request information through FOI. Track performance through BudgIT and state accountability platforms."},
    {id:"sf5",title:"Security Council",body:"Chaired by the governor, this council advises on internal security and coordinates with federal agencies.",cta:"Report concerns →",detail:"The council includes the Deputy Governor, Commissioner of Police, DSS Director, and military commanders. States also maintain security outfits like Amotekun (South-West) and Ebubeagu (South-East). Report crimes to police (112 or 199), DSS, or community security structures."},
    {id:"sf6",title:"State Education",body:"States manage secondary education, establish tertiary institutions, and set quality assurance policies.",cta:"Education rights →",detail:"The state Ministry of Education oversees curriculum, teacher recruitment, school inspection, and examinations. Every child has the right to free basic education under the UBE Act. States coordinate through SUBEB. Report violations — no child should be denied access for inability to pay fees."},
    {id:"sf7",title:"State IGR",body:"Internally Generated Revenue is what your state collects from taxes, fees, and levies — beyond federal allocations.",cta:"Check your state's IGR →",detail:"Internally Generated Revenue (IGR) includes personal income tax (PAYE and self-assessment), capital gains tax, stamp duties, land use charges, business premises levies, and fees for government services like vehicle registration. Lagos leads with over ₦700B annually while some states generate less than ₦10B. High IGR reduces dependency on volatile FAAC allocations. States publish IGR figures through the National Bureau of Statistics. Citizens should pay taxes and demand transparent reporting."},
    {id:"sf8",title:"State Health Board",body:"The State Hospital Management Board oversees general hospitals and specialist health facilities.",cta:"Find your nearest hospital →",detail:"The State Hospital Management Board (SHMB) oversees secondary healthcare facilities — general hospitals, specialist hospitals, and referral centres. It manages staff recruitment and deployment, drug procurement, equipment maintenance, and facility upgrades. Most states also have Teaching Hospitals affiliated with state universities. The State Health Insurance Agency provides coverage schemes. Report facility deficiencies, drug shortages, or staff issues to the SHMB or state Ministry of Health."},
    {id:"sf9",title:"Land Use Act",body:"All land in a state is vested in the Governor, who holds it in trust for the people.",cta:"Understand land ownership →",detail:"The Land Use Act 1978 vests all urban land in the Governor and all rural land in LGA authorities. To own land legally, you need a Certificate of Occupancy (C of O) from the Governor for urban land, or a Customary Right of Occupancy for rural land. Governor's consent is required for all land transactions (sales, mortgages, transfers). Always verify: confirm the seller has valid title, check for encumbrances at the Lands Registry, obtain a survey plan, and engage a lawyer."},
    {id:"sf10",title:"State Civil Service",body:"Career civil servants implement government policies and provide continuity across administrations.",cta:"How to join →",detail:"The State Civil Service Commission handles recruitment, promotions, discipline, and retirement of state civil servants. Entry is typically by competitive examination advertised publicly. The Head of Service is the administrative head of the civil service. Civil servants are expected to be politically neutral and serve any government. Promotion follows established guidelines based on years of service, qualifications, and performance. Recruitment must follow federal character principles."},
    {id:"sf11",title:"State Emergency Management",body:"SEMA coordinates disaster response, relief distribution, and emergency preparedness at the state level.",cta:"Emergency preparedness →",detail:"SEMA coordinates disaster preparedness, response, relief, rehabilitation, and reconstruction at the state level. It works with NEMA (federal), LGA emergency committees, and humanitarian organisations. SEMA maintains emergency response plans, manages relief materials, coordinates evacuations, runs temporary camps, and conducts post-disaster assessments. Call 112 for emergencies. Register vulnerable community members with your LGA emergency committee for priority assistance during disasters."},
    {id:"sf12",title:"Urban & Regional Planning",body:"State planning agencies regulate building construction, land use zoning, and urban development.",cta:"Building approval process →",detail:"Before constructing any building, you need planning permission from the relevant planning authority. The process involves: submitting architectural drawings prepared by a registered architect, obtaining environmental impact assessment (for large developments), structural approval by a registered engineer, and paying assessment fees. Unapproved structures face demolition orders. Building codes specify requirements for structural safety, fire safety, ventilation, sanitation, and accessibility."},
    {id:"sf13",title:"State Pension Board",body:"State pension authorities manage retirement benefits for state and local government workers.",cta:"Secure your retirement →",detail:"The Contributory Pension Scheme requires employees to contribute 8% and employers 10% of monthly salary to a Retirement Savings Account (RSA) managed by a licensed Pension Fund Administrator (PFA). Some states still operate the old Defined Benefits Scheme. To ensure a secure retirement: verify your monthly contributions are remitted, check your RSA balance regularly through your PFA, update your records, and report non-compliance to PenCom (pension.gov.ng)."},
    {id:"sf14",title:"State Boards & Parastatals",body:"States operate dozens of boards and parastatals managing everything from water to roads to housing.",cta:"Know your agencies →",detail:"Key state agencies include: Water Corporation (piped water supply), Roads Maintenance Agency, Housing Corporation, Waste Management Authority, Internal Revenue Service, Transport Authority, Agricultural Development Programme, Broadcasting Corporation, and various regulatory boards. Each has specific mandates and budgets. Find the appropriate agency for your complaint. Most agencies have public complaint mechanisms — use them and follow up in writing."},
    {id:"sf15",title:"Property Tax",body:"States levy property taxes (tenement rates) on buildings and land to fund local services.",cta:"Understand your tax obligations →",detail:"Property tax (tenement rate) is calculated as a percentage of the assessed annual rental value of your property. Revenue funds local services: road maintenance, drainage, street lighting, waste collection, and security. Rates vary by state, location, and property type (residential, commercial, industrial). Some states offer exemptions for owner-occupied properties below certain values. Non-payment can result in penalties, property liens, or court action. Always obtain receipts."},
    {id:"sf16",title:"State Scholarships",body:"Most states offer scholarship programmes for indigenes pursuing higher education within Nigeria and abroad.",cta:"Check eligibility →",detail:"State scholarship boards offer various programmes: merit-based scholarships for top students, needs-based awards for disadvantaged students, postgraduate scholarships for specific fields, and overseas scholarship programmes. Eligibility typically requires state indigeneship, academic merit (minimum grades), and financial need assessment. Apply through the State Scholarship Board — deadlines are usually annual. Some states also have bursary programmes for all indigene students in tertiary institutions."},
    {id:"sf17",title:"Environmental Protection",body:"State environmental agencies enforce pollution control, waste management, and environmental impact assessment.",cta:"Report pollution →",detail:"State environmental agencies enforce: pollution control (air, water, soil), waste disposal regulations, environmental impact assessments for new developments, noise pollution standards, and protected area management. Industries and construction projects must obtain environmental permits. Citizens can report illegal dumping, industrial pollution, deforestation, and other environmental violations. Penalties include fines, closure orders, and prosecution."},
    {id:"sf18",title:"Consumer Protection",body:"State consumer protection councils handle complaints about goods and services within the state.",cta:"Know your consumer rights →",detail:"State consumer protection councils mediate disputes between consumers and businesses, investigate complaints about defective goods or substandard services, monitor pricing of essential commodities, and educate consumers about their rights. You have the right to: products that meet safety standards, accurate information about products, fair pricing, and redress for defective goods. File complaints with receipts, photos, and documentation of the issue."},
    {id:"sf19",title:"Dispute Resolution",body:"States operate multi-door courthouses offering mediation, arbitration, and other alternatives to litigation.",cta:"Resolve disputes faster →",detail:"Multi-door courthouses provide Alternative Dispute Resolution (ADR) mechanisms: mediation (neutral third party facilitates agreement), arbitration (expert makes binding decision), conciliation, and early neutral evaluation. Benefits over traditional courts: faster resolution (days/weeks vs years), lower cost, privacy, preserved relationships, and flexible outcomes. Particularly useful for: commercial disputes, tenancy conflicts, family matters, community disputes, and employment issues."},
    {id:"sf20",title:"Voter Education",body:"Understanding the electoral process helps you make informed choices and protect your vote.",cta:"Election literacy →",detail:"Key voter knowledge: locate your polling unit BEFORE election day (use INEC's PU finder); bring only your PVC — no phones allowed in voting cubicles; voting is by thumbprinting the ballot paper; results should be publicly displayed and announced at your polling unit; you can serve as a party agent or independent observer; report irregularities to INEC officials, accredited observers, or the police; challenge results through the Election Petition Tribunal within 21 days."},
    {id:"sf21",title:"State Taxes",body:"Personal income tax, capital gains tax, and stamp duties are major revenue sources for state governments.",cta:"Tax obligations →",detail:"The State Internal Revenue Service (SIRS) collects: personal income tax (PAYE for employees, direct assessment for self-employed), capital gains tax on property sales, stamp duties on legal documents, withholding tax, and various levies. Tax compliance funds public services. Every taxable person must: register for a Tax Identification Number (TIN), file annual returns, and pay assessed taxes. Tax evasion carries penalties including fines and imprisonment."},
    {id:"sf22",title:"Agricultural Development",body:"States coordinate agricultural programmes including subsidised inputs, extension services, and market access.",cta:"Farming support →",detail:"State Agricultural Development Programmes (ADPs) provide: subsidised seeds, fertilisers, and agrochemicals; extension services (farm visits, demonstrations, training); disease and pest control assistance; market linkages and cooperative support; and facilitation of agricultural loans through the Bank of Agriculture, NIRSAL, and CBN intervention programmes. Youth agricultural programmes offer startup grants and training. Register with your LGA ADP office to access these services."},
    {id:"sf23",title:"Public-Private Partnerships",body:"States partner with private companies to deliver infrastructure and services through PPP arrangements.",cta:"Understand PPPs →",detail:"Public-Private Partnerships (PPPs) fund infrastructure projects where government partners with private companies. Common models: Build-Operate-Transfer (BOT), Build-Own-Operate (BOO), concessions, and management contracts. Projects include toll roads, power plants, housing estates, hospitals, and water treatment plants. PPP agreements should be transparent — citizens can request details through FOI. Assess whether PPPs provide value for money and protect public interest."},
    {id:"sf24",title:"Anti-Corruption at State Level",body:"State Houses of Assembly and anti-corruption agencies oversee the use of public funds.",cta:"Report misuse →",detail:"The State House of Assembly's Public Accounts Committee reviews the Auditor-General's reports on state expenditure. The Auditor-General independently audits all state and LGA accounts. Citizens can: petition the House of Assembly about misuse of funds, report to EFCC/ICPC for criminal investigation, use the whistle-blower policy for financial crimes, file FOI requests for spending details, and participate in budget monitoring through civil society organisations like BudgIT."}
  ],
  lga:[
    {id:"lf1",title:"LGA Chairman's Duties",body:"Your LGA chairman oversees local infrastructure, primary healthcare, and basic education.",cta:"Hold your chairman accountable →",detail:"The Chairman manages PHCs, primary schools, local roads, drains, markets, and motor parks. The Chairman presides over the LGA Council of elected councillors. LGAs receive FAAC funds, state allocations, and internally generated revenue. Attend Council meetings, request budget information, and report issues to your ward councillor."},
    {id:"lf2",title:"LGA Revenue",body:"LGAs receive funds from FAAC, state allocations, and internally generated revenue from rates and fees.",cta:"Know your LGA's revenue →",detail:"FAAC allocations are the largest source. The State Joint Local Government Account has been contentious — a 2024 Supreme Court ruling affirmed direct FAAC payments to LGAs. IGR includes market fees, property rates, business permits, and motor park charges. You have the right to know how much your LGA receives and spends."},
    {id:"lf3",title:"Primary Healthcare",body:"LGAs manage primary health centres — your first contact for immunisation, malaria treatment, and maternal care.",cta:"Find your nearest PHC →",detail:"PHCs provide immunisation, antenatal/postnatal care, safe delivery, malaria treatment, family planning, and health education. NPHCDA sets standards while LGAs handle daily management. Report drug shortages, staff absenteeism, or facility problems to the LGA Health Department or Ward Health Committee."},
    {id:"lf4",title:"Local Councils",body:"Each LGA has a legislative council that passes bye-laws, approves budgets, and debates local policies.",cta:"Attend a meeting →",detail:"Councillors represent wards. The council passes bye-laws, approves budgets, confirms appointments, and addresses petitions. Meetings are public. Standing committees handle Finance, Works, Health, and Education. Submit petitions through your councillor and attend committee hearings."},
    {id:"lf5",title:"Community Dev",body:"LGAs coordinate road maintenance, market management, waste collection, and development projects.",cta:"Report issues →",detail:"LGA responsibilities include local roads, drains, street lighting, community centres, markets, motor parks, waste collection, and sanitation. The CSDP funds community projects like boreholes and school blocks. Contact your councillor or LGA department head to report infrastructure failures."},
    {id:"lf6",title:"Traditional Rulers",body:"Traditional rulers work alongside LGA councils on conflict resolution, cultural preservation, and governance.",cta:"Know your leaders →",detail:"Obas, Obis, Emirs, and Chiefs serve as custodians of culture, adjudicators of disputes, advisers to government, community mobilisers, and bridges between government and grassroots. Approach your traditional ruler for community disputes, land issues, and cultural matters."},
    {id:"lf7",title:"Ward Development",body:"Each LGA is divided into wards — the smallest political unit where grassroots development happens.",cta:"Know your ward →",detail:"Wards are the smallest political units — each LGA is divided into 10-15 wards, each represented by a councillor. Ward Development Committees (WDCs) identify community needs, prioritise projects, and monitor implementation. Ward Health Committees oversee Primary Healthcare Centres. Town hall meetings at ward level give citizens the most direct access to local governance. Know your ward councillor's name, attend ward meetings regularly, and ensure your community's needs are documented."},
    {id:"lf8",title:"Primary Education",body:"LGAs manage primary schools — teacher deployment, school maintenance, and learning materials.",cta:"Support local schools →",detail:"The Local Government Education Authority (LGEA) manages primary schools: teacher recruitment and posting, school building construction and maintenance, provision of learning materials, and monitoring of attendance and academic standards. Works with the State Universal Basic Education Board (SUBEB) which provides federal intervention funds. Every child has a constitutional right to free basic education. Report schools in disrepair, teacher absenteeism, or illegal fee collection to the LGEA."},
    {id:"lf9",title:"Market Management",body:"LGAs administer markets — stall allocation, sanitation, security, and revenue collection.",cta:"Market traders' rights →",detail:"Markets generate significant revenue for LGAs through stall allocation fees, daily levies, and annual permits. The LGA Market Committee oversees stall allocation, sanitation enforcement, security provision, and dispute resolution. Traders' associations represent collective interests and negotiate with LGA authorities. Your rights as a trader: fair and transparent levy structure, official receipts for all payments, clean and safe facilities, and access to grievance mechanisms. Report extortion."},
    {id:"lf10",title:"Birth Registration",body:"Every child born in Nigeria must be registered within 60 days. LGAs process birth certificates.",cta:"Register your child →",detail:"Birth registration is free within 60 days of birth at any National Population Commission (NPC) office in your LGA. After 60 days, a late registration fee applies and you need a sworn affidavit. Required documents: hospital delivery record (or sworn declaration for home births), parents' identification, and two witnesses. Birth certificates are essential for: school enrollment, age verification, passport applications, national ID registration, and legal proceedings."},
    {id:"lf11",title:"Sanitation & Waste",body:"LGAs are responsible for refuse collection, drainage maintenance, and environmental sanitation in your community.",cta:"Report sanitation issues →",detail:"LGA Environmental Health Officers inspect food establishments, monitor water sources, enforce sanitation bylaws, coordinate monthly environmental sanitation exercises, and investigate disease outbreaks. The LGA manages: refuse collection schedules, public toilet facilities, drain and gutter maintenance, and abattoir operations. Report blocked drains, uncollected waste, illegal dumping, or food safety concerns to the LGA Environmental Health Department. Maintain clean surroundings — it's both a civic duty and a legal requirement."},
    {id:"lf12",title:"Local Security",body:"Community policing, vigilante groups, and neighbourhood watches work with police to keep your area safe.",cta:"Join community policing →",detail:"Community policing brings together the Nigeria Police, community leaders, and residents to address local security. LGAs coordinate with: Nigeria Police (emergency: 112/199), Civil Defence Corps (critical infrastructure protection), vigilante groups (operating under state law), and neighbourhood watch organisations. Community Policing Committees meet regularly to identify threats, share intelligence, and coordinate responses. Participate in your area's security architecture — community involvement dramatically reduces crime."},
    {id:"lf13",title:"Water & Sanitation",body:"Access to clean water is a basic right. LGAs maintain boreholes, wells, and small water schemes.",cta:"Report water issues →",detail:"LGAs maintain community water infrastructure: boreholes with hand pumps, solar-powered boreholes, small piped water schemes, and protected wells. Community Water, Sanitation and Hygiene Committees (WASHCOMs) manage village water points — collecting user fees, maintaining equipment, and ensuring water quality. Report: non-functional boreholes, contaminated water sources, waterborne disease outbreaks, or water disputes to your LGA Water and Sanitation Department. Safe water is a right."},
    {id:"lf14",title:"Agricultural Extension",body:"LGA agricultural officers provide farmers with improved seeds, techniques, and market information.",cta:"Access farming support →",detail:"Agricultural Extension Workers (AEWs) provide farm-level support: soil testing advice, improved seed varieties, fertiliser application techniques, pest and disease identification, harvest and post-harvest handling, and market price information. Each AEW covers a defined area. Register with your LGA Agriculture Department to receive scheduled farm visits. Farmer cooperatives can access bulk input purchases, group lending schemes, and collective marketing — strength in numbers."},
    {id:"lf15",title:"Local Planning",body:"LGAs issue building permits, enforce zoning regulations, and plan community layout.",cta:"Get a building permit →",detail:"Before building, obtain approval from the LGA Planning Authority. Process: submit building plans prepared by a registered architect/draughtsman, pay assessment fees, await site inspection and approval (typically 2-4 weeks). Building without approval risks demolition. Regulations cover: setbacks from roads and boundaries, building height limits, drainage requirements, structural safety standards, and land use zoning (residential, commercial, industrial). Always build on land with clear title."},
    {id:"lf16",title:"Social Welfare",body:"LGAs coordinate social welfare services for vulnerable groups — orphans, the elderly, and persons with disabilities.",cta:"Access support services →",detail:"LGA Social Welfare Officers handle cases involving: child abuse and neglect, domestic violence, destitution, disability support, and juvenile justice. They coordinate with NGOs, religious organisations, and community groups. National Social Investment Programme (NSIP) benefits accessed through LGA offices include: Conditional Cash Transfer (₦5,000/month for poorest households), Home-Grown School Feeding, N-Power (youth employment), and Government Enterprise and Empowerment Programme (GEEP) micro-loans."},
    {id:"lf17",title:"Fire & Emergency",body:"Local emergency response includes fire service, ambulance services, and disaster preparedness.",cta:"Emergency contacts →",detail:"Emergency contacts: 112 (national emergency), 199 (police emergency), Federal Fire Service (local numbers vary). LGAs coordinate local emergency response including: first aid provision, evacuation coordination, temporary shelter management, and relief distribution. Preparedness tips: know your nearest fire station and hospital emergency room, save emergency numbers, have a family evacuation plan, keep a basic first aid kit, and learn CPR. Community Emergency Response Teams (CERTs) welcome volunteers."},
    {id:"lf18",title:"Motor Parks",body:"LGAs manage motor parks — vehicle licensing points, transport unions, and interstate travel hubs.",cta:"Transport rights →",detail:"Motor parks are managed by LGAs with revenue from: parking fees, loading charges, route permits, and advertising. Transport unions — National Union of Road Transport Workers (NURTW) and Road Transport Employers' Association of Nigeria (RTEAN) — coordinate vehicle operations. Passenger rights: safe and roadworthy vehicles, fair and published fare structures, proper insurance coverage, respectful treatment, and accountability for lost luggage. Report overcharging, dangerous driving, or harassment."},
    {id:"lf19",title:"Youth Development",body:"LGAs coordinate youth programmes including skills training, sports, and empowerment schemes.",cta:"Youth opportunities →",detail:"LGA Youth and Sports Departments organise: skills acquisition programmes (tailoring, ICT, welding, agriculture), inter-LGA sporting competitions, cultural festivals, and youth leadership training. Federal youth programmes accessible through LGA offices: N-Power (200,000 annual slots), Youth Investment Fund, Tony Elumelu Foundation Entrepreneurship Programme, and various state youth empowerment schemes. Register with your LGA youth department and join local youth associations for networking and opportunities."},
    {id:"lf20",title:"Death Registration",body:"Deaths must be registered at the LGA for legal and statistical purposes.",cta:"Registration process →",detail:"Death registration is processed at the National Population Commission (NPC) office in your LGA. Required documents: medical certificate of cause of death (from attending doctor or hospital), identification of the deceased, death report from police (for unnatural deaths), and details of next of kin. Death certificates are essential for: inheritance proceedings, life insurance claims, pension benefit transfers, property title changes, and removal from voter register."},
    {id:"lf21",title:"Land Disputes",body:"Land disputes are common — know how to resolve them through proper channels.",cta:"Resolve disputes properly →",detail:"Land disputes are among the most common conflicts in Nigeria. Resolution channels (fastest to slowest): traditional rulers and community elders (binding in customary law areas), LGA Customary Courts (formal customary adjudication), Multi-Door Courthouse (mediation/arbitration), and State High Court (formal litigation). Before buying land: conduct a title search at the Lands Registry, verify the seller's ownership, obtain a proper survey, get Governor's consent for assignment, and use a lawyer."},
    {id:"lf22",title:"Community Meetings",body:"Town hall meetings are where citizens directly engage with local government on community issues.",cta:"Participate actively →",detail:"Town hall meetings, ward assemblies, and community gatherings are where citizens most directly influence governance. Effective participation: attend regularly (not just when you have a problem), raise issues constructively with evidence, document decisions and commitments made by officials, follow up on previous commitments, form or join community development associations, collaborate rather than confront, and share information widely. Democratic governance depends on informed, active citizens."},
    {id:"lf23",title:"Immunisation Schedule",body:"Every Nigerian child should complete their routine immunisation schedule — it's free at all PHCs.",cta:"Check the schedule →",detail:"Nigeria's National Immunisation Schedule provides free vaccines at all Primary Healthcare Centres: BCG (tuberculosis) at birth; Oral Polio Vaccine at birth, 6, 10, 14 weeks; Pentavalent (diphtheria, pertussis, tetanus, hepatitis B, Hib) at 6, 10, 14 weeks; PCV (pneumonia) at 6, 10, 14 weeks; Rotavirus at 6, 10 weeks; Measles at 9 and 15 months; Yellow Fever at 9 months. Keep your child's immunisation card safe — it's a legal health record."},
    {id:"lf24",title:"Civic Participation",body:"Democracy works best when citizens participate beyond just voting — engage at every level.",cta:"Get involved →",detail:"Active citizenship goes beyond voting. You can: attend LGA council meetings and ward assemblies; join or form community development associations; participate in budgeting processes and public hearings; volunteer as an election observer; join Parent-Teacher Associations at your children's schools; serve on ward health or development committees; file FOI requests for government information; petition your councillor or chairman; report corruption through proper channels; and educate neighbours about their civic rights and responsibilities."}
  ],
};
// Daily shuffle: picks 6 random cards based on today's date (consistent per day)
function dailyShuffle(arr,count=6){const d=new Date();const seed=d.getFullYear()*10000+d.getMonth()*100+d.getDate();const s=[...arr];for(let i=s.length-1;i>0;i--){const j=((seed*(i+1)*2654435761)>>>0)%((i+1));[s[i],s[j]]=[s[j],s[i]]}return s.slice(0,Math.min(count,s.length))}

/* ═══════════════════════════════════════════ NAIRAMOD ═══════════════════════════════════════════ */
const EH=[/\b(biafra\s*must\s*die|igbo\s*(?:are\s*)?thi(?:eves?|eving)|hausa\s*(?:are\s*)?(?:terrorist|backward)|yoruba\s*(?:are\s*)?(?:traitor|demon))/i];
const TH=[/\b(i\s*will\s*kill\s*you|we\s*go\s*finish\s*(?:you|them|una)|you\s*will\s*die)/i];
const SC=[/\b(send\s*your\s*atm|double\s*your\s*money|bitcoin\s*investment\s*guaranteed|mlm\s*opportunity)/i];
const EX=[/\b(p[o0]rn|xxx|nude\s*pics?|sex\s*tape)/i];
const AC=(t)=>t.length>40&&(t.replace(/[^A-Z]/g,"").length/t.replace(/\s/g,"").length)>.8;
const SR=/(.)\1{5,}|(\b\w+\b)(?:\s+\2){3,}/i;
function nMod(t,c){if(!t)return{ok:true};for(const r of EH)if(r.test(t))return{ok:false,r:"Ethnic hate speech is not allowed."};for(const r of TH)if(r.test(t))return{ok:false,r:"Threats of violence are not permitted."};for(const r of SC)if(r.test(t))return{ok:false,r:"Scam/MLM content is blocked."};for(const r of EX)if(r.test(t))return{ok:false,r:"Explicit content is not allowed."};if(AC(t))return{ok:false,r:"Please avoid writing in ALL CAPS."};if(SR.test(t))return{ok:false,r:"Spam or repetitive content detected."};if(/(?:0[789][01]\d{8}|\+234[789][01]\d{8})/.test(t)&&c!=="For Sale")return{ok:false,r:"Phone numbers only allowed in 'For Sale' and Inbox."};return{ok:true}}

/* ═══════════════════════════════════════════ AI HELPERS ═══════════════════════════════════════════ */
const AI_PROXY = SUPABASE_URL + "/functions/v1/ai-proxy";
function extractJSON(text){
  if(!text)return null;
  const clean=text.replace(/```json\s*/g,"").replace(/```/g,"").trim();
  try{return JSON.parse(clean)}catch(e){}
  // Try finding JSON array in text
  const aStart=clean.indexOf("[");const aEnd=clean.lastIndexOf("]");
  if(aStart!==-1&&aEnd>aStart){try{return JSON.parse(clean.slice(aStart,aEnd+1))}catch(e){}}
  // Try finding JSON object in text
  const oStart=clean.indexOf("{");const oEnd=clean.lastIndexOf("}");
  if(oStart!==-1&&oEnd>oStart){try{return JSON.parse(clean.slice(oStart,oEnd+1))}catch(e){}}
  return null;
}
const IS_ARTIFACT = typeof window !== "undefined" && window.location?.hostname?.includes("claude.ai");
const todayKey=()=>new Date().toISOString().slice(0,10);
function aiCacheGet(target){try{const d=JSON.parse(localStorage.getItem("nc_ai_"+target+"_"+todayKey())||"null");return d}catch(e){return null}}
function aiCacheSet(target,data){try{localStorage.setItem("nc_ai_"+target+"_"+todayKey(),JSON.stringify(data))}catch(e){}}

async function aiCall(systemPrompt, userPrompt, useSearch = false, maxTokens = 1000) {
  try {
    if (IS_ARTIFACT) {
      // In Claude artifact preview: call Anthropic directly (built-in auth)
      const body = { model: "claude-haiku-4-5-20251001", max_tokens: maxTokens, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] };
      if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      return { ok: true, text };
    } else {
      // On deployed site: route through Supabase Edge Function (API key stored as secret)
      const res = await fetch(AI_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + SUPABASE_ANON },
        body: JSON.stringify({ action: "ai", system: systemPrompt, prompt: userPrompt, useSearch, maxTokens })
      });
      const data = await res.json();
      if (data.error) return { ok: false, text: data.error };
      return { ok: true, text: data.text || "" };
    }
  } catch (e) { return { ok: false, text: "API error: " + e.message }; }
}

async function aiFetchHeadlines(target) {
  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:"Africa/Lagos" });
  const isNat = target==="National";
  const scope = isNat ? "Nigeria (national level)" : `${target} State, Nigeria`;
  const sys = `You are a senior Nigerian news editor for NairaClan. Today is ${today}. Search for today's REAL news only.`;
  const prompt = `Search for today's latest news (${today}) about ${scope}. Find 5 real, current headlines from today.

Return ONLY a JSON array of objects, each with:
- "title": the news headline (factual)
- "source": the source URL if available, otherwise ""
- "summary": 1 sentence summary of what happened

Return ONLY the JSON array. No markdown fences, no preamble, no explanation.`;
  return await aiCall(sys, prompt, true, 1500);
}

async function aiWriteArticle(headline, target) {
  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric", timeZone:"Africa/Lagos" });
  const isNat = target==="National";
  const scope = isNat ? "Nigeria" : `${target} State`;
  const sys = `You are a senior Nigerian news editor writing a detailed, publication-ready article for NairaClan, Nigeria's premier civic discussion forum. Writing standard: Premium Times, TheCable, Punch level.

Requirements:
- Clear, authoritative, professional English
- 3-5 well-structured paragraphs with specific facts: names, figures, dates, locations
- Provide context — explain WHY this matters to citizens of ${scope}
- Use direct attribution ("According to...", "The commissioner stated...")
- End with civic relevance — what citizens should know, do, or watch for
- IMPORTANT: Wrap EACH paragraph in <p> tags for proper formatting. Example: <p>First paragraph here.</p><p>Second paragraph here.</p>
- Today is ${today}`;

  const prompt = `Write a detailed forum article about this headline:
"${headline.title}"
${headline.source ? "Source: " + headline.source : ""}
${headline.summary ? "Summary: " + headline.summary : ""}

Return ONLY a JSON object with:
- "title": polished headline
- "body": the full article with each paragraph wrapped in <p> tags (e.g. "<p>Paragraph one.</p><p>Paragraph two.</p>")
- "source": "${headline.source || ""}"

Return ONLY the JSON. No markdown fences, no preamble.`;
  return await aiCall(sys, prompt, true, 3000);
}

async function aiGenReply(postTitle, postBody, state) {
  const sys = `You are a Nigerian citizen from ${state} State responding on NairaClan civic forum. Write as a regular person — use natural English, keep it brief (1-3 sentences). Show genuine civic concern. Do not use hashtags. Do not be overly formal. Do NOT include any JSON, code, or metadata in your reply.`;
  const prompt = `Post title: "${postTitle}"\nPost body: "${stripHtml(postBody).slice(0,500)}"\n\nIf this post is not relevant for a civic forum reply (e.g. spam, off-topic), respond with ONLY the word: SKIP\n\nOtherwise, write a short citizen reply (1-3 sentences). Output ONLY the reply text, nothing else.`;
  return await aiCall(sys, prompt, false);
}

function contentSweep(allPosts) {
  const results = [];
  const batch = allPosts.slice(0, 20);
  for (const p of batch) {
    const titleCheck = nMod(p.title, p.category);
    const bodyCheck = nMod(p.body, p.category);
    if (!titleCheck.ok) results.push({ post: p, reason: titleCheck.r, source: "title" });
    else if (!bodyCheck.ok) results.push({ post: p, reason: bodyCheck.r, source: "body" });
    else results.push({ post: p, reason: null, source: null });
  }
  return results;
}

/* ═══════════════════════════════════════════ CSS ═══════════════════════════════════════════ */
const CSS=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
:root,[data-theme="dark"]{--bg0:#080d0b;--bg1:#0f1612;--bg2:#161e1a;--bg3:#1c2520;--txt:#eef3f0;--txt2:#8aa595;--txt3:#4a5e54;--grn:#059669;--gd:rgba(5,150,105,.13);--red:#dc2626;--bdr:rgba(255,255,255,.06);--glass:rgba(15,22,18,.82)}
[data-theme="light"]{--bg0:#f4f7f5;--bg1:#ffffff;--bg2:#edf2ee;--bg3:#e4ebe6;--txt:#0c1a10;--txt2:#2d4a36;--txt3:#5a7560;--grn:#059669;--gd:rgba(5,150,105,.1);--red:#dc2626;--bdr:rgba(0,60,30,.09);--glass:rgba(255,255,255,.82)}
*{margin:0;padding:0;box-sizing:border-box}html{font-size:16px}body{font-family:'Inter',system-ui,sans-serif;background:var(--bg0);color:var(--txt);line-height:1.5;overflow-x:hidden}button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}input,textarea,select{font-family:inherit}::selection{background:var(--grn);color:#fff}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:var(--txt3);border-radius:3px}
.app{min-height:100dvh;padding-top:48px;padding-bottom:72px}@media(min-width:769px){.app{padding-bottom:0}}
.hdr{position:fixed;top:0;left:0;right:0;height:48px;background:var(--glass);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-bottom:1px solid var(--bdr);z-index:200;display:flex;align-items:center;padding:0 14px;gap:8px}
.hdr-logo{display:flex;align-items:center;gap:5px;cursor:pointer;flex-shrink:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.hdr-nav{display:none}@media(min-width:769px){.hdr-nav{display:flex;gap:2px;margin:0 auto;background:var(--bg2);border-radius:10px;padding:3px}.hdr-nav button{padding:6px 18px;border-radius:8px;font-size:13px;font-weight:600;color:var(--txt2);transition:all .2s}.hdr-nav button.on{background:var(--grn);color:#fff}}
.hdr-r{margin-left:auto;display:flex;align-items:center;gap:4px}
.ib{position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:background .2s;font-size:15px;color:var(--txt2);flex-shrink:0;cursor:pointer}.ib:hover{background:var(--bg2);color:var(--txt)}.ib svg{display:block;flex-shrink:0}
.badge{position:absolute;top:2px;right:2px;min-width:16px;height:16px;background:var(--red);color:#fff;font-size:10px;font-weight:700;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 4px}
.bg{padding:6px 12px;border-radius:10px;font-size:11px;font-weight:600;color:var(--txt2);border:1px solid var(--bdr);transition:all .2s;white-space:nowrap}.bg:hover{border-color:var(--grn);color:var(--grn)}
.bp{padding:6px 16px;border-radius:10px;font-size:11px;font-weight:600;background:var(--grn);color:#fff;transition:all .2s;white-space:nowrap}.bp:hover{filter:brightness(1.1)}.bp:active{transform:translateY(0)}.bp:disabled{opacity:.4;cursor:not-allowed}
.sd{position:absolute;top:calc(100% + 6px);right:0;width:200px;background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:300;overflow:hidden;animation:di .18s ease-out}@keyframes di{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.sd-i{display:flex;align-items:center;gap:10px;padding:11px 14px;font-size:12px;font-weight:500;color:var(--txt2);transition:all .15s;cursor:pointer}.sd-i:hover{background:var(--bg2);color:var(--txt)}.sd-i.dng{color:var(--red)}.sd-d{height:1px;background:var(--bdr)}
.bnav{position:fixed;bottom:0;left:0;right:0;height:68px;background:var(--glass);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-top:1px solid var(--bdr);z-index:200;display:flex;align-items:stretch;padding-bottom:env(safe-area-inset-bottom)}@media(min-width:769px){.bnav{display:none}}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:10px;font-weight:600;color:var(--txt3);transition:color .2s;-webkit-tap-highlight-color:transparent;min-height:44px}.bni.on{color:var(--grn)}.bni .bi{font-size:22px;line-height:1}
.hero{background:linear-gradient(135deg,#031f12 0%,#064e32 50%,#03311f 100%);position:relative;overflow:hidden;padding:16px 16px 14px;text-align:center}.hero::before{content:'';position:absolute;top:-40%;right:-20%;width:300px;height:300px;background:radial-gradient(circle,rgba(5,150,105,.25) 0%,transparent 70%);border-radius:50%;pointer-events:none}
.hero-c{position:relative;z-index:1;max-width:600px;margin:0 auto}
.hl{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:6px}.hld{width:8px;height:8px;border-radius:50%;background:#ff0000;box-shadow:0 0 6px #ff0000,0 0 12px rgba(255,0,0,.4);animation:livep 1.5s infinite}@keyframes livep{0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 6px #ff0000,0 0 12px rgba(255,0,0,.4)}50%{opacity:.7;transform:scale(1.4);box-shadow:0 0 10px #ff0000,0 0 20px rgba(255,0,0,.6)}}
.hck{font-size:24px;font-weight:900;color:#fff;letter-spacing:-.02em;line-height:1;margin-bottom:6px;font-variant-numeric:tabular-nums}.hck span{font-size:12px;font-weight:600;color:rgba(255,255,255,.45);margin-left:4px}
.hero h1{font-size:clamp(16px,4vw,22px);font-weight:800;line-height:1.25;letter-spacing:-.03em;color:#fff;margin-bottom:5px}.hero h1 em{color:#ff3b3b;font-style:normal}
.hero-sub{font-size:11px;color:rgba(255,255,255,.5);line-height:1.5;margin-bottom:10px;max-width:400px;margin-left:auto;margin-right:auto}
.hs{display:flex;justify-content:center;gap:20px;font-size:11px;color:rgba(255,255,255,.5);font-weight:500;margin-bottom:10px}.hs strong{color:rgba(255,255,255,.85);font-weight:700}
.hctas{display:flex;justify-content:center;gap:10px;margin-bottom:10px}
.hsrc{position:relative;max-width:460px;margin:0 auto}.hsrc input{width:100%;padding:10px 16px 10px 40px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:#fff;font-size:13px;outline:none;transition:all .2s}.hsrc input::placeholder{color:rgba(255,255,255,.35)}.hsrc input:focus{border-color:var(--grn)}.hsrc .si{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;color:rgba(255,255,255,.4);pointer-events:none}
.fw{max-width:680px;margin:0 auto;padding:0 12px}@media(min-width:769px){.fw{padding:0 20px}}
.tabs{display:flex;gap:0;border-bottom:1px solid var(--bdr);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}
.tab{padding:9px 12px;font-size:11px;font-weight:600;color:var(--txt3);white-space:nowrap;border-bottom:2px solid transparent;transition:all .2s;min-height:40px;display:flex;align-items:center}.tab.on{color:var(--grn);border-bottom-color:var(--grn)}
.cg{display:flex;flex-wrap:wrap;gap:6px;padding:10px 0}.cc{padding:5px 10px;border-radius:8px;background:var(--bg2);font-size:10px;font-weight:600;color:var(--txt2);transition:all .2s;cursor:pointer}.cc:hover{background:var(--gd);color:var(--grn)}.cc.on{background:var(--gd);color:var(--grn);border:1px solid rgba(5,150,105,.25)}
.ew{position:relative;padding:14px 0}.ev{overflow:hidden;border-radius:14px;border:1px solid var(--bdr)}.et{display:flex;transition:transform .5s cubic-bezier(.4,0,.2,1)}.es{min-width:100%;padding:20px;background:linear-gradient(135deg,var(--bg2) 0%,var(--bg3) 100%)}.es h3{font-size:12px;font-weight:700;margin-bottom:6px}.es p{font-size:11px;color:var(--txt2);line-height:1.55;margin-bottom:10px}.es .ec{font-size:11px;color:var(--grn);font-weight:600}
.ed{display:flex;justify-content:center;gap:6px;margin-top:10px}.dot{width:6px;height:6px;border-radius:50%;background:var(--txt3);opacity:.35;transition:all .3s;cursor:pointer}.dot.on{opacity:1;background:var(--grn);width:18px;border-radius:3px}
.pc{padding:12px;background:var(--bg1);border:1px solid var(--bdr);border-radius:12px;cursor:pointer;transition:background .15s;display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}.pc:active{background:var(--bg2)}.pcb{flex:1;min-width:0}.pcm{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px}.pcu{font-size:11px;font-weight:600}.pcr{font-size:10px}.pctm{font-size:10px;color:var(--txt3);margin-left:auto}.pctg{display:inline-flex;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700}.brk{background:rgba(220,38,38,.15);color:#ef4444}.hot{background:rgba(234,88,12,.12);color:#f97316}
.pct{font-size:12px;font-weight:700;line-height:1.35;letter-spacing:-.01em;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pcp{font-size:10px;color:var(--txt3);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

.pcf{display:flex;align-items:center;gap:14px;margin-top:6px;font-size:11px;color:var(--txt3)}.pcf span{display:flex;align-items:center;gap:4px}.pcch{color:var(--txt3);font-size:14px;flex-shrink:0;align-self:center;margin-left:4px}
.tb{display:flex;align-items:center;gap:6px;padding:12px 0;font-size:12px;font-weight:600;color:var(--txt2);cursor:pointer;min-height:44px}.tb:hover{color:var(--grn)}
.tp{padding:16px 0;border-bottom:1px solid var(--bdr)}.tph{display:flex;align-items:center;gap:10px;margin-bottom:14px}.tpi{flex:1}.tpu{font-size:12px;font-weight:700;cursor:pointer}.tpu:hover{color:var(--grn)}.tpd{font-size:11px;color:var(--txt3);display:flex;align-items:center;gap:6px}
.tpt{font-size:16px;font-weight:800;line-height:1.3;letter-spacing:-.02em;margin-bottom:8px}.tpbd{font-size:12px;line-height:1.65;color:var(--txt2)}.tpbd p{margin:0 0 12px}
.tpa{display:flex;flex-wrap:wrap;gap:4px;margin-top:16px;padding-top:14px;border-top:1px solid var(--bdr)}
.ab{padding:5px 8px;border-radius:8px;font-size:10px;font-weight:600;color:var(--txt3);display:flex;align-items:center;gap:4px;transition:all .15s;min-height:32px}.ab:hover{background:var(--bg2);color:var(--txt2)}.ab.liked{color:var(--grn)}.ab.disliked{color:var(--red)}.ab.bkd{color:#b45309}
.rh{padding:14px 0 10px;font-size:11px;font-weight:700;color:var(--txt2)}.rc{padding:14px;background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;margin-bottom:10px}.rct{display:flex;align-items:center;gap:8px;margin-bottom:8px}.rcu{font-size:11px;font-weight:600}.rctm{font-size:10px;color:var(--txt3)}.rced{font-size:9px;color:var(--txt3);font-style:italic}
.rcbd{font-size:12px;line-height:1.6;color:var(--txt2)}.rcq{border-left:3px solid var(--grn);padding:8px 12px;margin-bottom:8px;border-radius:0 8px 8px 0;background:var(--gd);font-size:11px;color:var(--txt3);cursor:pointer}.rcq strong{color:var(--txt2);font-weight:600}.rca{display:flex;gap:4px;margin-top:8px}
.cmp{padding:16px 0;border-top:1px solid var(--bdr);margin-top:8px}.cmp textarea{width:100%;min-height:80px;padding:12px;border-radius:12px;border:1px solid var(--bdr);background:var(--bg2);color:var(--txt);font-size:14px;line-height:1.5;resize:vertical;outline:none;transition:border-color .2s;font-family:inherit}.cmp textarea:focus{border-color:var(--grn)}.cmpb{display:flex;justify-content:space-between;align-items:center;margin-top:10px}
.cmpbar{display:flex;gap:2px;padding:4px 0;align-items:center}.cmpbar button{padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;color:var(--txt3);background:transparent;min-height:32px;transition:all .12s}.cmpbar button:active{background:var(--bg2);color:var(--txt)}.cmpbar .fmt-b{font-weight:800}.cmpbar .fmt-i{font-style:italic}
.emoji-grid{display:flex;flex-wrap:wrap;gap:2px;padding:6px 0}.emoji-grid button{width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;border-radius:8px;background:transparent}.emoji-grid button:active{background:var(--bg2)}
.quote-box{background:var(--bg2);border-left:3px solid var(--grn);border-radius:0 8px 8px 0;padding:8px 12px;margin-bottom:8px;font-size:12px;color:var(--txt3);display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.quote-box strong{color:var(--txt2)}
.rich-ed{width:100%;min-height:70px;padding:10px;border-radius:12px;border:1px solid var(--bdr);background:var(--bg2);color:var(--txt);font-size:12px;line-height:1.5;outline:none;overflow-y:auto;transition:border-color .2s;font-family:inherit;-webkit-user-modify:read-write-plaintext-only;word-wrap:break-word}.rich-ed:focus{border-color:var(--grn)}.rich-ed:empty::before{content:attr(data-placeholder);color:var(--txt3);pointer-events:none}.rich-ed b,.rich-ed strong{font-weight:700}.rich-ed i,.rich-ed em{font-style:italic}
.photo-grid{display:flex;gap:6px;flex-wrap:wrap;padding:6px 0}.photo-thumb{position:relative;width:72px;height:72px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr)}.photo-thumb img{width:100%;height:100%;object-fit:cover}.photo-thumb .photo-rm{position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:10px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.post-imgs{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.post-imgs img{max-width:100%;border-radius:10px;max-height:300px;object-fit:cover;cursor:pointer}
.post-imgs.multi img{width:calc(50% - 3px);max-height:180px}
.del-confirm{background:var(--bg1);border:1px solid var(--bdr);border-radius:16px;padding:20px;max-width:340px;width:90%;text-align:center}
.del-confirm h3{font-size:16px;font-weight:800;margin-bottom:8px}.del-confirm p{font-size:13px;color:var(--txt3);margin-bottom:16px}
.rate-msg{font-size:12px;color:var(--red);padding:6px 0;font-weight:500}
.mok{font-size:11px;color:var(--grn);font-weight:600}.mfl{font-size:11px;color:var(--red);font-weight:500}

.fh{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--txt2);padding:18px 0 4px;display:flex;align-items:center;gap:8px}
/* POLL */
.poll{background:var(--bg2);border-radius:14px;padding:16px;margin:14px 0}.poll-q{font-size:12px;font-weight:700;margin-bottom:12px}
.poll-opt{margin-bottom:8px;cursor:pointer}.poll-bar{height:36px;border-radius:8px;background:var(--bg3);position:relative;overflow:hidden;display:flex;align-items:center;padding:0 12px}.poll-fill{position:absolute;left:0;top:0;bottom:0;background:var(--gd);border-radius:8px;transition:width .5s}.poll-lbl{position:relative;z-index:1;font-size:11px;font-weight:600;display:flex;justify-content:space-between;width:100%}
.poll-voted .poll-bar{cursor:default}
/* MODAL */
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:8px}
.am{background:var(--bg1);border-radius:18px;border:1px solid var(--bdr);width:100%;max-width:420px;max-height:90dvh;overflow-y:auto}
.amh{padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between}.amt{font-size:20px;font-weight:800;letter-spacing:-.02em}.amx{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--txt3);transition:all .2s}.amx:hover{background:var(--bg2);color:var(--txt)}.ambd{padding:20px}
.amst{display:flex;gap:6px;margin-bottom:20px}.ams{flex:1;height:3px;border-radius:2px;background:var(--bg3);transition:background .3s}.ams.dn{background:var(--grn)}.ams.cr{background:var(--grn);opacity:.6}
.fld{margin-bottom:12px}.fld label{display:block;font-size:10px;font-weight:600;color:var(--txt2);margin-bottom:4px}.fld input,.fld select,.fld textarea{width:100%;padding:9px 11px;border-radius:10px;border:1px solid var(--bdr);background:var(--bg2);color:var(--txt);font-size:12px;outline:none;transition:border-color .2s;min-height:40px}.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--grn)}.fld select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238aa595' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
.amft{padding:0 20px 20px;display:flex;flex-direction:column;gap:10px}.amft .bp{width:100%;padding:11px;font-size:12px;text-align:center}.amsw{text-align:center;font-size:12px;color:var(--txt3)}.amsw button{color:var(--grn);font-weight:600;text-decoration:underline;font-size:12px}
.ls{background:var(--bg2);border-radius:12px;padding:14px;margin:12px 0}.ls div{display:flex;justify-content:space-between;padding:4px 0;font-size:12px}.ls .ll{color:var(--txt3)}.ls .lv{font-weight:600}
.gi{display:flex;gap:10px;padding:8px 0;font-size:12px;color:var(--txt2);align-items:flex-start}.gi span:first-child{font-size:16px;flex-shrink:0}
.cbr{display:flex;align-items:flex-start;gap:10px;padding:14px 0}.cbr input[type=checkbox]{width:20px;height:20px;accent-color:var(--grn);flex-shrink:0;cursor:pointer}.cbr label{font-size:13px;color:var(--txt2);line-height:1.4;cursor:pointer}
.pm{background:var(--bg1);border-radius:18px;border:1px solid var(--bdr);width:100%;max-width:560px;max-height:90dvh;overflow-y:auto}.pmbd{padding:20px}.pmbd textarea{min-height:120px}
/* PROFILE */
.prof-hd{text-align:center;padding:24px 16px;border-bottom:1px solid var(--bdr)}.prof-av{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:24px;color:#fff;margin:0 auto 12px}
.prof-name{font-size:18px;font-weight:800;margin-bottom:2px}.prof-un{font-size:13px;color:var(--txt3);margin-bottom:4px}.prof-title{font-size:11px;color:var(--grn);font-weight:600;margin-bottom:8px}
.prof-bio{font-size:13px;color:var(--txt2);line-height:1.5;max-width:360px;margin:0 auto 12px}
.prof-loc{display:flex;justify-content:center;gap:12px;font-size:11px;color:var(--txt3);margin-bottom:14px}.prof-loc span{background:var(--bg2);padding:4px 10px;border-radius:6px}
.prof-stats{display:flex;justify-content:center;gap:24px;font-size:13px}.prof-stats div{text-align:center}.prof-stats strong{display:block;font-size:16px;font-weight:800}.prof-stats span{font-size:11px;color:var(--txt3)}
.prof-actions{display:flex;justify-content:center;gap:8px;margin-top:14px}
.prof-strikes{display:flex;justify-content:center;gap:4px;margin-top:10px}.strike-dot{width:10px;height:10px;border-radius:50%;background:var(--bg3)}.strike-dot.active{background:var(--red)}
/* INBOX */
.msg-item{display:flex;gap:12px;padding:14px;background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;cursor:pointer;align-items:flex-start;margin-bottom:10px}.msg-item:active{background:var(--bg2)}
.msg-body{flex:1;min-width:0}.msg-subj{font-size:12px;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.msg-prev{font-size:10px;color:var(--txt3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.msg-tm{font-size:10px;color:var(--txt3);flex-shrink:0}.msg-unread .msg-subj{color:var(--grn)}
/* NOTIF DROPDOWN */
.nd{position:absolute;top:calc(100% + 6px);right:0;width:320px;max-height:400px;overflow-y:auto;background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:300;animation:di .18s ease-out}
.ni{display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--bdr);cursor:pointer;transition:background .15s;font-size:13px}.ni:hover{background:var(--bg2)}.ni.unread{background:var(--gd)}.ni-t{font-weight:600;margin-bottom:2px}.ni-b{font-size:11px;color:var(--txt3)}.ni-tm{font-size:10px;color:var(--txt3);margin-top:2px}
/* SEARCH */
.srch-input{width:100%;padding:12px 16px 12px 42px;border-radius:12px;border:1px solid var(--bdr);background:var(--bg2);color:var(--txt);font-size:14px;outline:none;margin:16px 0 8px}.srch-input:focus{border-color:var(--grn)}
.member-card{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--bdr);align-items:center;cursor:pointer}.member-card:active{background:var(--bg2)}.mc-info{flex:1}.mc-name{font-size:14px;font-weight:600}.mc-meta{font-size:11px;color:var(--txt3)}
.fab{position:fixed;bottom:84px;right:16px;width:52px;height:52px;border-radius:16px;background:var(--grn);color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(5,150,105,.4);z-index:150;transition:all .2s}.fab:hover{transform:scale(1.06)}.fab:active{transform:scale(.96)}@media(min-width:769px){.fab{bottom:32px;right:32px}}
.empty{text-align:center;padding:48px 20px;color:var(--txt3)}.empty-ic{font-size:40px;margin-bottom:12px;opacity:.5}.empty p{font-size:14px}
/* LEADERS */
.ldr-card{background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;padding:18px;margin-bottom:10px;cursor:pointer;transition:all .15s;display:flex;gap:14px;align-items:center}.ldr-card:hover{border-color:var(--grn);background:var(--gd)}
.ldr-av{width:52px;height:52px;border-radius:14px;background:var(--grn);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#fff;flex-shrink:0}
.ldr-info{flex:1;min-width:0}.ldr-name{font-size:15px;font-weight:700;margin-bottom:2px}.ldr-role{font-size:12px;color:var(--txt3)}.ldr-party{display:inline-block;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700;background:var(--gd);color:var(--grn);margin-top:4px}
.ldr-profile{padding:20px 0}.ldr-ph{text-align:center;margin-bottom:20px}.ldr-ph .ldr-av{width:72px;height:72px;font-size:24px;margin:0 auto 12px;border-radius:50%}
.ldr-duties{margin-top:16px}.ldr-duties h3{font-size:13px;font-weight:700;color:var(--txt2);margin-bottom:10px}.ldr-duty{display:flex;gap:8px;padding:8px 0;font-size:13px;color:var(--txt2);align-items:flex-start}.ldr-duty span:first-child{color:var(--grn);font-weight:700}
/* GUIDELINES */
.gl-section{margin-bottom:24px}.gl-sh{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--bdr)}.gl-sh span{font-size:20px}
.gl-rule{display:flex;gap:10px;padding:10px 0;font-size:13px;color:var(--txt2);line-height:1.5}.gl-num{width:24px;height:24px;border-radius:8px;background:var(--gd);color:var(--grn);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0}
.gl-strike{background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;padding:16px;margin-bottom:10px}.gl-strike-hd{display:flex;align-items:center;gap:8px;margin-bottom:6px}.gl-strike-dots{display:flex;gap:4px}.gl-strike-dot{width:10px;height:10px;border-radius:50%}.gl-strike-lbl{font-size:14px;font-weight:700}.gl-strike-desc{font-size:13px;color:var(--txt2);line-height:1.5}
.gl-appeal{background:var(--gd);border-radius:14px;padding:16px;margin-top:16px;font-size:13px;color:var(--grn);line-height:1.5}
/* AD BANNER */
.ad-wrap{position:relative;padding:14px 0}.ad-viewport{overflow:hidden;border-radius:14px;margin:0 -0px}
.ad-track{display:flex;transition:transform .5s cubic-bezier(.4,0,.2,1)}
.ad-slide{min-width:100%;height:160px;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden}
.ad-slide-bg{position:absolute;inset:0;background:linear-gradient(135deg,#064e32,#0a7c52);opacity:.9}
.ad-slide-content{position:relative;z-index:1;text-align:center;color:#fff;padding:16px}.ad-slide-content h3{font-size:16px;font-weight:800;margin-bottom:4px}.ad-slide-content p{font-size:11px;opacity:.7}
.ad-label{position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;color:rgba(255,255,255,.5);background:rgba(0,0,0,.2);padding:2px 6px;border-radius:4px;z-index:2}
/* CIVIC EDU FULL PAGE */
.edu-full-card{background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;padding:16px;margin-bottom:10px;cursor:pointer;transition:all .15s}.edu-full-card:hover{border-color:var(--grn)}
.edu-full-card h3{font-size:14px;font-weight:700;margin-bottom:4px}.edu-full-card p{font-size:12px;color:var(--txt2);line-height:1.5;margin-bottom:6px}.edu-full-card .ec{font-size:11px;color:var(--grn);font-weight:600}
.edu-detail{padding:20px 0}.edu-detail h1{font-size:20px;font-weight:800;margin-bottom:12px}.edu-detail .ed-body{font-size:15px;line-height:1.7;color:var(--txt2);margin-bottom:16px}.edu-detail .ed-cta{display:inline-block;padding:10px 20px;border-radius:10px;background:var(--gd);color:var(--grn);font-size:13px;font-weight:600}
/* AI FEATURES */
.ai-box{background:var(--bg1);border:1px solid var(--bdr);border-radius:14px;padding:16px;margin-bottom:12px}
.ai-box h3{font-size:14px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.ai-status{padding:10px 14px;border-radius:10px;font-size:12px;font-weight:500;margin:10px 0;line-height:1.5}
.ai-ok{background:var(--gd);color:var(--grn)}.ai-err{background:rgba(220,38,38,.08);color:var(--red)}.ai-loading{background:var(--bg2);color:var(--txt3)}
.ai-gen{display:inline-flex;align-items:center;gap:6px}.ai-spin{display:inline-block;width:14px;height:14px;border:2px solid var(--txt3);border-top-color:var(--grn);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.ai-tag{display:inline-flex;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(124,58,237,.12);color:#7c3aed}
.promo-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(234,88,12,.1);color:#f97316}
.sweep-result{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--bdr);font-size:13px}.sweep-ok{color:var(--grn)}.sweep-flag{color:var(--red);font-weight:600}
/* ADMIN DASHBOARD */
.adm{padding-bottom:76px}
.adm-hdr{padding:16px 12px 8px;display:flex;align-items:center;justify-content:space-between}.adm-hdr h2{font-size:18px;font-weight:800;letter-spacing:-.02em}
.adm-bnav{position:fixed;bottom:0;left:0;right:0;height:68px;background:var(--glass);backdrop-filter:blur(28px);border-top:1px solid var(--bdr);z-index:500;display:flex;align-items:stretch;padding-bottom:env(safe-area-inset-bottom);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}.adm-bnav::-webkit-scrollbar{display:none}
.adm-tab{flex:0 0 auto;min-width:64px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:9px;font-weight:600;color:var(--txt3);padding:0 10px;white-space:nowrap;transition:color .2s}.adm-tab.on{color:var(--grn)}.adm-tab .ati{font-size:20px;line-height:1}
.adm-content{max-width:680px;margin:0 auto;padding:0 12px}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.stat-card{background:var(--bg1);border:1px solid var(--bdr);border-radius:12px;padding:14px}.stat-card strong{display:block;font-size:22px;font-weight:800;margin-bottom:2px}.stat-card span{font-size:11px;color:var(--txt3);font-weight:500}
.rpt-card{background:var(--bg1);border:1px solid var(--bdr);border-radius:12px;padding:14px;margin-bottom:8px}
.rpt-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}.rpt-title{font-size:14px;font-weight:700}.rpt-sev{font-size:10px;font-weight:700;padding:2px 8px;border-radius:5px}
.rpt-meta{font-size:12px;color:var(--txt3);margin-bottom:8px}
.rpt-actions{display:flex;gap:6px}.rpt-actions button{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;min-height:36px}
.usr-row{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--bdr);align-items:center}.usr-info{flex:1;min-width:0}.usr-name{font-size:14px;font-weight:600}.usr-meta{font-size:11px;color:var(--txt3)}.usr-actions{display:flex;gap:4px;flex-shrink:0}
.team-card{background:var(--bg1);border:1px solid var(--bdr);border-radius:12px;padding:14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
.team-info{flex:1}.team-name{font-size:14px;font-weight:700}.team-role{font-size:12px;color:var(--txt3)}.team-scope{font-size:11px;color:var(--grn);font-weight:600;margin-top:2px}
.ad-mgr{background:var(--bg1);border:1px solid var(--bdr);border-radius:12px;padding:14px;margin-bottom:8px}
.ad-mgr-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.ad-mgr-title{font-size:14px;font-weight:700}.ad-mgr-scope{font-size:11px;color:var(--txt3)}
.ad-mgr-cd{font-size:12px;color:var(--grn);font-weight:600;font-variant-numeric:tabular-nums;margin:4px 0}
.ad-mgr-actions{display:flex;gap:6px;margin-top:8px}
.log-row{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--bdr);font-size:13px}.log-actor{font-weight:600;flex-shrink:0;min-width:80px}.log-action{color:var(--txt2);flex:1}.log-time{font-size:11px;color:var(--txt3);flex-shrink:0}
.more-sheet{position:fixed;bottom:0;left:0;right:0;background:var(--bg1);border-top-left-radius:18px;border-top-right-radius:18px;border:1px solid var(--bdr);box-shadow:0 -8px 30px rgba(0,0,0,.3);z-index:600;padding:12px 0 calc(12px + env(safe-area-inset-bottom));animation:sheetUp .25s ease-out}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.more-sheet-item{display:flex;align-items:center;gap:12px;padding:14px 20px;font-size:14px;font-weight:500;color:var(--txt2);cursor:pointer;transition:background .15s}.more-sheet-item:hover{background:var(--bg2)}
.strike-modal{background:var(--bg1);border-radius:18px;border:1px solid var(--bdr);width:100%;max-width:400px;padding:20px}
.strike-bar{display:flex;gap:4px;margin:12px 0}.strike-pip{flex:1;height:6px;border-radius:3px;background:var(--bg3)}.strike-pip.filled{background:var(--red)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}`;

/* ═══════════════════════════════════════════ COMPONENTS ═══════════════════════════════════════════ */
function Av({name,size=36,color,onClick,src}){return src?<img onClick={onClick} src={src} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",cursor:onClick?"pointer":"default",flexShrink:0}}/>:<div onClick={onClick} style={{width:size,height:size,borderRadius:"50%",background:color||gc(name),display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*.34,color:"#fff",cursor:onClick?"pointer":"default",flexShrink:0}}>{gi(name)}</div>}
function RB({role}){return (role&&role!=="member")?<span className="pcr" title={role}>{ROLE_BADGES[role]}</span>:null}
function TP({tag,isB,isH}){if(isB)return <span className="pctg brk">BREAKING</span>;if(isH)return <span className="pctg hot">HOT</span>;if(!tag)return null;const h=TAG_HUE[tag]??150;return <span className="pctg" style={{background:`hsla(${h},60%,50%,.12)`,color:`hsl(${h},55%,55%)`}}>{tag}</span>}

function PostCard({post,onClick}){const bp=stripHtml(post.body);return (
  <div className="pc" onClick={onClick}><Av name={post.author.username} size={30} src={post.author.avatar}/><div className="pcb"><div className="pcm"><span className="pcu">{post.author.username}</span><RB role={post.author.role}/><TP tag={post.tag} isB={post.isBreaking} isH={post.isHot}/>{(post.promotedTo||[]).length>0&&<span className="promo-badge">⬆</span>}<span className="pctm">{post.time}</span></div><div className="pct">{post.title}</div><div className="pcp">{bp.slice(0,120)}{bp.length>120?"…":""}</div></div><span className="pcch">›</span></div>
)}

function EduC({level}){const all=CIVIC[level]||CIVIC.national;const s=useMemo(()=>dailyShuffle(all,6),[level]);const[i,setI]=useState(0);const ref=useRef(null);
  const rst=useCallback(()=>{if(ref.current)clearInterval(ref.current);ref.current=setInterval(()=>setI(x=>(x+1)%s.length),10000)},[s.length]);
  useEffect(()=>{rst();return()=>clearInterval(ref.current)},[rst]);const go=(x)=>{setI(x);rst()};
  return <div className="ew"><div className="ev"><div className="et" style={{transform:`translateX(-${i*100}%)`}}>{s.map(c=><div className="es" key={c.id}><h3>{c.title}</h3><p>{c.body}</p><span className="ec">{c.cta}</span></div>)}</div></div><div className="ed">{s.map((_,x)=><div key={x} className={`dot${x===i?" on":""}`} onClick={()=>go(x)}/>)}</div></div>}

function CatGrid({cats,active,onSelect}){return <div className="cg">{cats.map(c=><div key={c.name} className={`cc${active===c.name?" on":""}`} onClick={()=>onSelect(active===c.name?null:c.name)}>{c.name}</div>)}</div>}
function LiveClock(){const[t,setT]=useState("");useEffect(()=>{const tk=()=>setT(new Date().toLocaleString("en-NG",{timeZone:"Africa/Lagos",hour:"numeric",minute:"2-digit",second:"2-digit",hour12:true}).toUpperCase());tk();const id=setInterval(tk,1000);return()=>clearInterval(id)},[]);const p=t.split(" ");return <div className="hck">{p[0]} <span>{p[1]}</span></div>}

/* ═══════════════════════════════════════════ POLL COMPONENT ═══════════════════════════════════════════ */
function PollBlock({poll,postId,userId,onVote}){
  if(!poll)return null;
  const total=poll.votes.reduce((a,b)=>a+b,0);const voted=poll.voted[userId];
  return <div className={`poll${voted!=null?" poll-voted":""}`}><div className="poll-q">{poll.question}</div>
    {poll.opts.map((o,i)=>{const pct=total>0?Math.round(poll.votes[i]/total*100):0;
      return <div className="poll-opt" key={i} onClick={()=>voted==null&&onVote(postId,i)}>
        <div className="poll-bar"><div className="poll-fill" style={{width:voted!=null?`${pct}%`:"0%"}}/><div className="poll-lbl"><span>{o}{voted===i?" ✓":""}</span>{voted!=null&&<span>{pct}%</span>}</div></div>
      </div>})}
    <div style={{fontSize:11,color:"var(--txt3)",marginTop:8}}>{total} vote{total!==1?"s":""}</div>
  </div>}

/* ─── AD BANNER CAROUSEL ─── */
function AdBanner({ads}){const[i,setI]=useState(0);const ref=useRef(null);
  const rst=useCallback(()=>{if(ref.current)clearInterval(ref.current);if(ads.length>1)ref.current=setInterval(()=>setI(x=>(x+1)%ads.length),10000)},[ads.length]);
  useEffect(()=>{rst();return()=>clearInterval(ref.current)},[rst]);
  return <div className="ad-wrap"><div className="ad-viewport"><div className="ad-track" style={{transform:`translateX(-${i*100}%)`}}>
    {ads.map(a=><div key={a.id} className="ad-slide" onClick={()=>a.linkUrl&&a.linkUrl!=="#"&&window.open(a.linkUrl,"_blank")} style={a.imgUrl?{backgroundImage:`url(${a.imgUrl})`,backgroundSize:"cover",backgroundPosition:"center"}:{}}>
      {!a.imgUrl&&<div className="ad-slide-bg"/>}<span className="ad-label">AD</span>
      <div className="ad-slide-content"><h3>{a.title}</h3><p>{a.linkUrl&&a.linkUrl!=="#"?"Tap to visit":"Sponsored"}</p></div>
    </div>)}
  </div></div>{ads.length>1&&<div className="ed">{ads.map((_,x)=><div key={x} className={`dot${x===i?" on":""}`} onClick={()=>{setI(x);rst()}}/>)}</div>}</div>}

/* ─── SMART CAROUSEL — ads override civic edu per scope ─── */
function SmartCarousel({level,scope,ads}){
  const sa=(ads||[]).filter(a=>a.status==="active"&&a.endDate>Date.now()&&(a.scopes||[]).includes(scope)).slice(0,6);
  if(sa.length>0)return <AdBanner ads={sa}/>;
  return <EduC level={level}/>;
}

/* ─── CIVIC EDUCATION FULL PAGE ─── */
function CivicEduFullPage({go}){const[lvl,setLvl]=useState("national");const[sub,setSub]=useState("today");
  const slides=CIVIC[lvl]||[];const today=useMemo(()=>dailyShuffle(slides,6),[lvl]);const featured=useMemo(()=>{const d=new Date();return dailyShuffle(slides.slice().reverse(),4)},[lvl]);
  return <div className="fw" style={{paddingTop:16}}>
    <h2 style={{fontSize:18,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Civic Education</h2>
    <p style={{fontSize:12,color:"var(--txt3)",marginBottom:14}}>Learn how Nigeria's government works at every level. {slides.length} topics available — 6 rotate daily.</p>
    <div className="tabs"><button className={`tab${lvl==="national"?" on":""}`} onClick={()=>{setLvl("national");setSub("today")}}>🇳🇬 Federal</button><button className={`tab${lvl==="state"?" on":""}`} onClick={()=>{setLvl("state");setSub("today")}}>🏛️ State</button><button className={`tab${lvl==="lga"?" on":""}`} onClick={()=>{setLvl("lga");setSub("today")}}>🏘️ LGA</button></div>
    <div className="tabs" style={{borderBottom:"none",marginBottom:8}}><button className={`tab${sub==="today"?" on":""}`} onClick={()=>setSub("today")}>Today's 6</button><button className={`tab${sub==="featured"?" on":""}`} onClick={()=>setSub("featured")}>Featured</button><button className={`tab${sub==="all"?" on":""}`} onClick={()=>setSub("all")}>All Topics ({slides.length})</button></div>
    {sub==="today"&&<><EduC level={lvl}/><div style={{marginTop:8}}>{today.map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s})}><h3>{s.title}</h3><p>{s.body}</p><span className="ec">{s.cta}</span></div>)}</div></>}
    {sub==="featured"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,paddingTop:8}}>{featured.map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s})}><h3>{s.title}</h3><p style={{fontSize:11}}>{s.body.slice(0,80)}…</p></div>)}</div>}
    {sub==="all"&&<div style={{paddingTop:8}}>{slides.map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s})}><h3>{s.title}</h3><p>{s.body}</p><span className="ec">{s.cta}</span></div>)}</div>}
  </div>}

function EduDetailPage({slide,go,backView}){
  if(!slide)return <div className="fw"><div className="empty"><p>Slide not found.</p></div></div>;
  const back=backView||"civicedu";const backLabel=back==="leaders"?"Know Your Leaders":"Civic Education";
  return <div className="fw" style={{paddingTop:16}}><div className="edu-detail"><h1>{slide.title}</h1><div className="ed-body" style={{whiteSpace:"pre-wrap"}}>{slide.detail||slide.body}</div><div className="ed-cta">{slide.cta}</div></div></div>}

/* ─── LEADERS PAGE ─── */
function LeadersPage({go,user}){
  const uS=user?.origin;const uL=user?.lga;
  const stLeaders=LEADERS.stateLeaders[uS]||[];const lgLeaders=LEADERS.lgaLeaders[uL]||[];
  return <div className="fw" style={{paddingTop:16}}>
    <h2 style={{fontSize:18,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Know Your Leaders</h2>
    <p style={{fontSize:12,color:"var(--txt3)",marginBottom:16}}>These are the elected officials who represent you at every level of government. Tap any leader to see their full responsibilities.</p>

    {lgLeaders.length>0&&<><div className="fh">🏘️ Your LGA — {uL}</div>{lgLeaders.map(l=><div key={l.id} className="ldr-card" onClick={()=>go("leaderprofile",{leader:l})}><div className="ldr-av" style={{background:gc(l.name)}}>{gi(l.name)}</div><div className="ldr-info"><div className="ldr-name">{l.name}</div><div className="ldr-role">{l.title}</div><span className="ldr-party">{l.party}</span></div></div>)}
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",color:"var(--txt3)",padding:"12px 0 6px"}}>📚 Learn about LGA governance</div>
      {CIVIC.lga.slice(0,3).map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s,backView:"leaders"})}><h3>{s.title}</h3><p>{s.body}</p><span className="ec">{s.cta}</span></div>)}
    </>}

    {stLeaders.length>0&&<><div className="fh">🏛️ Your State — {uS}</div>{stLeaders.map(l=><div key={l.id} className="ldr-card" onClick={()=>go("leaderprofile",{leader:l})}><div className="ldr-av" style={{background:gc(l.name)}}>{gi(l.name)}</div><div className="ldr-info"><div className="ldr-name">{l.name}</div><div className="ldr-role">{l.title}</div><span className="ldr-party">{l.party}</span></div></div>)}
      <div style={{fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",color:"var(--txt3)",padding:"12px 0 6px"}}>📚 Learn about state governance</div>
      {CIVIC.state.slice(0,3).map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s,backView:"leaders"})}><h3>{s.title}</h3><p>{s.body}</p><span className="ec">{s.cta}</span></div>)}
    </>}

    <div className="fh">🇳🇬 Federal</div>
    {LEADERS.federal.map(l=><div key={l.id} className="ldr-card" onClick={()=>go("leaderprofile",{leader:l})}><div className="ldr-av" style={{background:gc(l.name)}}>{gi(l.name)}</div><div className="ldr-info"><div className="ldr-name">{l.name}</div><div className="ldr-role">{l.title}</div><span className="ldr-party">{l.party}</span></div></div>)}
    <div style={{fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",color:"var(--txt3)",padding:"12px 0 6px"}}>📚 Learn about federal governance</div>
    {CIVIC.national.slice(0,3).map(s=><div key={s.id} className="edu-full-card" onClick={()=>go("edu",{slide:s,backView:"leaders"})}><h3>{s.title}</h3><p>{s.body}</p><span className="ec">{s.cta}</span></div>)}

    {lgLeaders.length===0&&stLeaders.length===0&&<div className="ai-status ai-loading" style={{marginTop:12}}>Leader data for {uL}, {uS} is being compiled. Check back soon.</div>}
  </div>}

function LeaderProfilePage({leader,go}){
  if(!leader)return <div className="fw"><div className="empty"><p>Leader not found.</p></div></div>;
  return <div className="fw" style={{paddingTop:16}}><div className="ldr-profile"><div className="ldr-ph"><div className="ldr-av" style={{background:gc(leader.name),borderRadius:"50%"}}>{gi(leader.name)}</div><div style={{fontSize:20,fontWeight:800}}>{leader.name}</div><div style={{fontSize:13,color:"var(--txt3)",marginTop:2}}>{leader.title}{leader.state?`, ${leader.state}`:""}</div><span className="ldr-party" style={{marginTop:6}}>{leader.party}</span></div><div style={{fontSize:14,lineHeight:1.6,color:"var(--txt2)",padding:"12px 4px"}}>{leader.bio}</div>{leader.duties&&<div className="ldr-duties"><h3>Key Duties & Powers</h3>{leader.duties.map((d,i)=><div key={i} className="ldr-duty"><span>•</span><span>{d}</span></div>)}</div>}</div></div>}

/* ─── GUIDELINES PAGE ─── */
function GuidelinesFullPage(){return <div className="fw" style={{paddingTop:16}}>
  <h2 style={{fontSize:18,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Community Guidelines</h2>
  <p style={{fontSize:12,color:"var(--txt3)",marginBottom:20}}>NairaClan is a space for civic discourse. These rules keep it safe and productive.</p>
  {GUIDELINES_DATA.sections.map((s,si)=><div className="gl-section" key={si}><div className="gl-sh"><span>{s.icon}</span>{s.title}</div>{s.rules.map(r=><div className="gl-rule" key={r.num}><span className="gl-num">{r.num}</span><span>{r.text}</span></div>)}</div>)}
  <h3 style={{fontSize:15,fontWeight:700,marginBottom:12,marginTop:8}}>⚖️ {GUIDELINES_DATA.strikes.title}</h3>
  {GUIDELINES_DATA.strikes.items.map(s=><div className="gl-strike" key={s.level}><div className="gl-strike-hd"><div className="gl-strike-dots">{[1,2,3].map(i=><div key={i} className="gl-strike-dot" style={{background:i<=s.level?"var(--red)":"var(--bg3)"}}/>)}</div><span className="gl-strike-lbl">{s.label}</span></div><div className="gl-strike-desc">{s.desc}</div></div>)}
  <div className="gl-appeal"><strong>📩 Appeals Process</strong><br/>{GUIDELINES_DATA.appeals}</div>
</div>}

/* ═══════════════════════════════════════════ AUTH ═══════════════════════════════════════════ */
const GUIDE=[["🤝","No hate speech or tribal attacks"],["🔍","Verify before you post"],["🚫","No scams or MLM schemes"],["💬","Criticise leaders freely — civic duty"],["📵","No phone numbers (except For Sale)"],["🛡️","Report violations"],["⚖️","3 strikes = suspension"],["🇳🇬","Stay on topic"],["📷","No explicit imagery"],["❤️","Build community"]];

function SignIn({onClose,onSwitch,onLogin}){const[un,setUn]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");
  return <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="am"><div className="amh"><span className="amt">Sign In</span><button className="amx" onClick={onClose}>✕</button></div><div className="ambd">{err&&<div style={{color:"var(--red)",fontSize:13,marginBottom:12,fontWeight:500}}>{err}</div>}<div className="fld"><label>Username</label><input value={un} onChange={e=>setUn(e.target.value)} placeholder="Enter your username"/></div><div className="fld"><label>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter your password"/></div></div><div className="amft"><button className="bp" onClick={()=>{if(!un||!pw){setErr("All fields required.");return}const u=MU.find(x=>x.username.toLowerCase()===un.toLowerCase());if(u){onLogin(u);onClose()}else setErr("Try 'NairaBoss', 'ChiefAda', 'KanoTruth', or 'PHCitizen'.")}}>Sign In</button><div className="amsw">No account? <button onClick={onSwitch}>Join NairaClan</button></div></div></div></div>}

function Register({onClose,onSwitch,onReg}){const[step,setStep]=useState(1);const[f,setF]=useState({name:"",username:"",email:"",password:"",confirmPw:"",originState:"",originLga:"",residenceState:"",residenceLga:"",sameState:false,agreed:false});const[err,setErr]=useState("");const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const next=()=>{setErr("");if(step===1){if(!f.name||!f.username||!f.email||!f.password||!f.confirmPw){setErr("All fields required.");return}if(f.username.length<3){setErr("Username min 3 chars.");return}if(f.password.length<8){setErr("Password min 8 chars.");return}if(f.password!==f.confirmPw){setErr("Passwords don't match.");return}}if(step===2){if(!f.originState||!f.originLga){setErr("Select origin state & LGA.");return}if(!f.sameState&&(!f.residenceState||!f.residenceLga)){setErr("Select residence.");return}}if(step<3)setStep(s=>s+1);else{if(!f.agreed){setErr("Accept guidelines.");return}onReg({id:"u"+Date.now(),username:f.username,name:f.name,email:f.email,origin:f.originState,residence:f.sameState?f.originState:f.residenceState,lga:f.originLga,lgaResidence:f.sameState?f.originLga:f.residenceLga,role:"member",strikes:0,status:"active",posts:0,followers:0,following:0,bio:"",title:"New Member"});onClose()}};
  const rS=f.sameState?f.originState:f.residenceState,rL=f.sameState?f.originLga:f.residenceLga;
  return <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="am"><div className="amh"><span className="amt">Join NairaClan</span><button className="amx" onClick={onClose}>✕</button></div><div className="ambd"><div className="amst"><div className={`ams${step>=1?" dn":""}`}/><div className={`ams${step>=2?" dn":""}${step===2?" cr":""}`}/><div className={`ams${step>=3?" dn":""}${step===3?" cr":""}`}/></div>{err&&<div style={{color:"var(--red)",fontSize:13,marginBottom:12,fontWeight:500}}>{err}</div>}
    {step===1&&<><div className="fld"><label>Full Name</label><input value={f.name} onChange={e=>u("name",e.target.value)} placeholder="Your full name"/></div><div className="fld"><label>Username</label><input value={f.username} onChange={e=>u("username",e.target.value.replace(/[^a-zA-Z0-9_]/g,""))} placeholder="3–20 chars"/></div><div className="fld"><label>Email</label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@example.com"/></div><div className="fld"><label>Password</label><input type="password" value={f.password} onChange={e=>u("password",e.target.value)} placeholder="Min 8 chars"/>{f.password&&f.password.length<8&&<div style={{fontSize:11,color:"var(--red)",marginTop:4}}>Password must be at least 8 characters</div>}</div><div className="fld"><label>Confirm Password</label><input type="password" value={f.confirmPw} onChange={e=>u("confirmPw",e.target.value)} placeholder="Re-enter password"/>{f.confirmPw&&f.confirmPw!==f.password&&<div style={{fontSize:11,color:"var(--red)",marginTop:4}}>⚠ Passwords do not match</div>}{f.confirmPw&&f.confirmPw===f.password&&f.password.length>=8&&<div style={{fontSize:11,color:"var(--grn)",marginTop:4}}>✓ Passwords match</div>}</div></>}
    {step===2&&<><div style={{background:"var(--gd)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--grn)",lineHeight:1.5}}>📍 We use your origin and residence to personalise your forum experience — connecting you to discussions, leaders, and civic updates in your State and LGA.</div><div className="fld"><label>State of Origin</label><select value={f.originState} onChange={e=>{u("originState",e.target.value);u("originLga","")}}><option value="">Select…</option>{ALL_STATES.map(s=><option key={s}>{s}</option>)}</select></div>{f.originState&&<div className="fld"><label>LGA of Origin</label><select value={f.originLga} onChange={e=>u("originLga",e.target.value)}><option value="">Select…</option>{(NIGERIA_STATE_LGAS[f.originState]||[]).map(l=><option key={l}>{l}</option>)}</select></div>}<div style={{padding:"10px 0"}}><label style={{display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,color:"var(--txt2)",cursor:"pointer"}}><input type="checkbox" checked={f.sameState} onChange={e=>u("sameState",e.target.checked)} style={{width:18,height:18,accentColor:"var(--grn)"}}/>I live in my state of origin</label></div>{!f.sameState&&<><div className="fld"><label>Residence State</label><select value={f.residenceState} onChange={e=>{u("residenceState",e.target.value);u("residenceLga","")}}><option value="">Select…</option>{ALL_STATES.map(s=><option key={s}>{s}</option>)}</select></div>{f.residenceState&&<div className="fld"><label>Residence LGA</label><select value={f.residenceLga} onChange={e=>u("residenceLga",e.target.value)}><option value="">Select…</option>{(NIGERIA_STATE_LGAS[f.residenceState]||[]).map(l=><option key={l}>{l}</option>)}</select></div>}</>}{f.originState&&f.originLga&&(f.sameState||(f.residenceState&&f.residenceLga))&&<div className="ls"><div><span className="ll">Origin</span><span className="lv">{f.originLga}, {f.originState}</span></div><div><span className="ll">Residence</span><span className="lv">{rL}, {rS}</span></div></div>}</>}
    {step===3&&<><div style={{marginBottom:14}}>{GUIDE.map(([ic,tx],i)=><div className="gi" key={i}><span>{ic}</span><span>{tx}</span></div>)}</div><div className="cbr"><input type="checkbox" id="ag" checked={f.agreed} onChange={e=>u("agreed",e.target.checked)}/><label htmlFor="ag">I agree to the Community Guidelines. I am at least 13.</label></div></>}
  </div><div className="amft"><div style={{display:"flex",gap:10}}>{step>1&&<button className="bg" style={{flex:1}} onClick={()=>setStep(s=>s-1)}>Back</button>}<button className="bp" style={{flex:1}} onClick={next} disabled={step===3&&!f.agreed}>{step===3?"Create Account":"Continue"}</button></div>{step===1&&<div className="amsw">Have an account? <button onClick={onSwitch}>Sign In</button></div>}</div></div></div>}

const EMOJIS=["😀","😂","🤣","😍","🥰","😎","🤔","😢","😤","🔥","💯","👏","🙏","💪","❤️","💔","👍","👎","🎉","🎯","✅","❌","⚠️","💡","📢","🇳🇬","🏛️","🏘️","💰","📈","📉","🚨","🗳️","📜","⚖️","🤝"];
function RichCompose({editorRef,placeholder,minH,photos,setPhotos}){
  const[showEmoji,setShowEmoji]=useState(false);const fileRef=useRef(null);
  const exec=(cmd,val)=>{editorRef.current?.focus();document.execCommand(cmd,false,val||null)};
  const insertEmoji=(e)=>{editorRef.current?.focus();const sel=window.getSelection();if(sel&&sel.rangeCount){const range=sel.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(e));range.collapse(false);sel.removeAllRanges();sel.addRange(range)}else if(editorRef.current){editorRef.current.innerHTML+=e}setShowEmoji(false)};
  const addPhotos=(e)=>{const files=Array.from(e.target.files||[]);if(!setPhotos)return;const cur=photos||[];const remaining=4-cur.length;const valid=files.filter(f=>f.size<=5*1024*1024&&f.type.startsWith("image/")).slice(0,remaining);valid.forEach(f=>{const r=new FileReader();r.onload=()=>setPhotos(p=>[...(p||[]),r.result].slice(0,4));r.readAsDataURL(f)});e.target.value=""};
  return <><div className="cmpbar">
    <button className="fmt-b" onMouseDown={e=>e.preventDefault()} onClick={()=>exec("bold")} title="Bold">B</button>
    <button className="fmt-i" onMouseDown={e=>e.preventDefault()} onClick={()=>exec("italic")} title="Italic">I</button>
    {setPhotos&&<button onMouseDown={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()} title="Photos" style={{fontSize:15}}>📷 <span style={{fontSize:11,fontWeight:400}}>{(photos||[]).length}/4</span></button>}
    <div style={{flex:1}}/>
    <button onClick={()=>setShowEmoji(s=>!s)} style={{fontSize:16}}>{showEmoji?"✕":"😀"}</button>
  </div>
  {showEmoji&&<div className="emoji-grid">{EMOJIS.map((em,i)=><button key={i} onMouseDown={e=>e.preventDefault()} onClick={()=>insertEmoji(em)}>{em}</button>)}</div>}
  {setPhotos&&<input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addPhotos}/>}
  {photos&&photos.length>0&&<div className="photo-grid">{photos.map((p,i)=><div key={i} className="photo-thumb"><img src={p} alt=""/><div className="photo-rm" onClick={()=>setPhotos(ps=>ps.filter((_,j)=>j!==i))}>✕</div></div>)}</div>}
  <div ref={editorRef} className="rich-ed" contentEditable data-placeholder={placeholder||"Write something…"} style={minH?{minHeight:minH}:{}} onPaste={e=>{e.preventDefault();const text=e.clipboardData.getData("text/plain");document.execCommand("insertText",false,text)}}/>
  </>}

function NewPost({onClose,onSubmit,forum,state,lga,defaultCat}){
  const isNational=forum==="national";
  const initCat=isNational?"News":(defaultCat||"News");
  const[t,setT]=useState("");const[c,setC]=useState(initCat);const[mr,setMr]=useState(null);const[showPoll,setShowPoll]=useState(false);const[pq,setPq]=useState("");const[po,setPo]=useState(["","",""]);const[postPhotos,setPostPhotos]=useState([]);
  const cats=isNational?[{name:"News"}]:CATEGORIES;
  const bodyRef=useRef(null);
  const submit=()=>{const bText=bodyRef.current?.innerText||"";const bHtml=bodyRef.current?.innerHTML||"";const ct=nMod(t,c);const cb=nMod(bText,c);if(!ct.ok){setMr(ct);return}if(!cb.ok){setMr(cb);return}if(!t.trim()||!bText.trim())return;const poll=showPoll&&pq.trim()&&po.filter(x=>x.trim()).length>=2?{question:pq,opts:po.filter(x=>x.trim()),votes:po.filter(x=>x.trim()).map(()=>0),voted:{}}:null;onSubmit({title:t,body:bHtml,bodyText:bText,category:c,tag:c,forum,state,lga,poll,images:postPhotos});onClose()};
  return <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="pm"><div className="amh"><span className="amt">New Post</span><button className="amx" onClick={onClose}>✕</button></div><div className="pmbd">
    <div style={{fontSize:12,color:"var(--txt3)",marginBottom:14,fontWeight:500}}>Posting to {forum==="national"?"National Forum":forum==="state"?`${state} State`:`${lga} LGA`}</div>
    <div className="fld"><label>Category</label><select value={c} onChange={e=>setC(e.target.value)} disabled={isNational}>{cats.map(x=><option key={x.name} value={x.name}>{x.name}</option>)}</select>{isNational&&<div style={{fontSize:11,color:"var(--txt3)",marginTop:4}}>National forum posts are categorised as News only.</div>}</div>
    <div className="fld"><label>Title</label><input value={t} onChange={e=>setT(e.target.value)} placeholder="What's happening?"/></div>
    <div className="fld"><label>Body</label><RichCompose editorRef={bodyRef} placeholder="Share details…" photos={postPhotos} setPhotos={setPostPhotos}/></div>
    <div style={{marginBottom:14}}><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,color:"var(--txt2)",cursor:"pointer"}}><input type="checkbox" checked={showPoll} onChange={e=>setShowPoll(e.target.checked)} style={{width:18,height:18,accentColor:"var(--grn)"}}/>Add a poll</label></div>
    {showPoll&&<div style={{background:"var(--bg2)",borderRadius:12,padding:14,marginBottom:14}}><div className="fld"><label>Poll Question</label><input value={pq} onChange={e=>setPq(e.target.value)} placeholder="Ask a question…"/></div>{po.map((o,i)=><div className="fld" key={i}><label>Option {i+1}</label><input value={o} onChange={e=>{const n=[...po];n[i]=e.target.value;setPo(n)}} placeholder={`Option ${i+1}`}/></div>)}{po.length<4&&<button className="bg" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setPo(p=>[...p,""])}>+ Add Option</button>}</div>}
    {mr&&!mr.ok&&<div className="mfl">🛡️ NairaMod: {mr.r}</div>}
  </div><div className="amft"><button className="bp" onClick={submit} disabled={!t.trim()||(mr&&!mr.ok)}>Publish Post</button></div></div></div>}

/* ═══════════════════════════════════════════ MAIN APP ═══════════════════════════════════════════ */
export default function NairaClan(){
  const[theme,setTheme]=useState("light");
  const[view,setView]=useState("home");const[vx,setVx]=useState({});
  const[modal,setModal]=useState(null);const[user,setUser]=useState(null);
  const[posts,setPosts]=useState(MP);const[reps,setReps]=useState(MR);
  const[aCat,setACat]=useState(null);
  const[sdOpen,setSdOpen]=useState(false);const[ndOpen,setNdOpen]=useState(false);
  const[bookmarks,setBookmarks]=useState([]);const[myVotes,setMyVotes]=useState({});
  const[ads,setAds]=useState(MOCK_ADS);
  const[botStates,setBotStates]=useState(()=>{const s={};ALL_STATES.forEach(st=>s[st]=true);return s});
  const[reports,setReports]=useState(MOCK_REPORTS);const[team,setTeam]=useState(MOCK_TEAM);
  const[actLog,setActLog]=useState(MOCK_LOG);const[suspended,setSuspended]=useState({});
  const[following,setFollowing]=useState([]);const[msgs,setMsgs]=useState(MOCK_MSGS);
  const[notifs,setNotifs]=useState(MOCK_NOTIFS);const[inboxTab,setInboxTab]=useState("received");
  const[searchQ,setSearchQ]=useState("");const[searchTab,setSearchTab]=useState("posts");
  const[profTab,setProfTab]=useState("posts");const[admTab,setAdmTab]=useState("overview");

  useEffect(()=>{document.documentElement.setAttribute("data-theme",theme)},[theme]);
  useEffect(()=>{const fav=document.querySelector("link[rel='icon']")||document.createElement("link");fav.rel="icon";fav.type="image/svg+xml";fav.href="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="#1B4332"/><path d="M 8 26 A 8 8 0 0 1 24 26" fill="none" stroke="#F2EDE0" stroke-width="3" stroke-linecap="round"/><path d="M 4 26 A 12 12 0 0 1 28 26" fill="none" stroke="#F2EDE0" stroke-width="3" stroke-linecap="round" stroke-opacity="0.5"/><circle cx="16" cy="26" r="2.2" fill="#C9850A"/></svg>');document.head.appendChild(fav)},[]);

  // Browser history support — phone back button navigates within app
  const go=useCallback((v,x={})=>{setView(v);setVx(x);setACat(null);setSdOpen(false);setNdOpen(false);window.scrollTo(0,0);try{if(v==="home"){window.history.replaceState({view:"home",vx:{}},"")}else{window.history.pushState({view:v,vx:x},"")}}catch(e){}},[]);
  useEffect(()=>{window.history.replaceState({view:"home",vx:{}},"");const onPop=(e)=>{const s=e.state;if(s&&s.view&&s.view!=="home"){setView(s.view);setVx(s.vx||{});setACat(null);setSdOpen(false);setNdOpen(false);window.scrollTo(0,0)}else{setView("home");setVx({});window.history.replaceState({view:"home",vx:{}},"");window.history.pushState({view:"home",vx:{}},"")}};window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop)},[])
  const isIn=!!user;

  const feed=useMemo(()=>{let fp=posts;
    const promo=(p,lvl)=>(p.promotedTo||[]).includes(lvl);
    if(view==="home")fp=fp.filter(p=>p.forum==="national"||promo(p,"national"));
    if(view==="state")fp=fp.filter(p=>p.state===vx.state&&(p.forum==="state"||promo(p,"state")));
    if(view==="lga")fp=fp.filter(p=>p.forum==="lga"&&p.lga===vx.lga);
    if(view==="nat")fp=fp.filter(p=>p.forum==="national"||promo(p,"national"));
    if(aCat)fp=fp.filter(p=>p.category===aCat);
    return fp.sort((a,b)=>(b.ts||0)-(a.ts||0))},[posts,view,vx,aCat]);

  const onLogin=(u)=>setUser(u);const onReg=(u)=>{MU.push(u);setUser(u)};
  const[lastPostTime,setLastPostTime]=useState(0);const[deleteConfirm,setDeleteConfirm]=useState(null);
  const POST_COOLDOWN=60000;const REPLY_COOLDOWN=30000;
  const canMod=isIn&&(user.role==="admin"||user.role==="super_admin"||user.role==="state_mod"||user.role==="lga_mod");
  const checkRate=(type)=>{const cd=type==="post"?POST_COOLDOWN:REPLY_COOLDOWN;const elapsed=Date.now()-lastPostTime;if(elapsed<cd)return Math.ceil((cd-elapsed)/1000);return 0};
  // Promotion: 15+ replies within 3hrs of posting triggers auto-promote (LGA→State, State→National)
  const TREND_REPLIES=15;const TREND_WINDOW=3*60*60*1000;
  const canPromote=(p)=>p.category==="News"&&((p.forum==="lga"&&!(p.promotedTo||[]).includes("state"))||(p.forum==="state"&&!(p.promotedTo||[]).includes("national")));
  const isTrending=(p)=>p.replies>=TREND_REPLIES&&(Date.now()-p.ts)<=TREND_WINDOW;
  const promotePost=(pid,target)=>{setPosts(ps=>ps.map(p=>p.id===pid?{...p,promotedTo:[...(p.promotedTo||[]),target]}:p));logAction("Promoted post",`"${posts.find(p=>p.id===pid)?.title?.slice(0,40)}" → ${target}`)};
  // Auto-promote trending News posts
  useEffect(()=>{posts.forEach(p=>{if(p.category!=="News")return;if(p.forum==="lga"&&!(p.promotedTo||[]).includes("state")&&isTrending(p))promotePost(p.id,"state");if(p.forum==="state"&&!(p.promotedTo||[]).includes("national")&&isTrending(p))promotePost(p.id,"national")})},[posts.map(p=>p.replies+":"+p.ts).join(",")]);

  const addPost=(d)=>{const wait=checkRate("post");if(wait>0)return;setLastPostTime(Date.now());setPosts(p=>[{id:"p"+Date.now(),author:user,forum:d.forum,state:d.state||user?.origin,lga:d.lga||user?.lga,category:d.category,tag:d.tag,title:d.title,body:d.body,poll:d.poll,images:d.images||[],likes:0,dislikes:0,replies:0,views:0,time:"just now",ts:Date.now(),isBreaking:false,isHot:false,_edited:false,promotedTo:[]},...p])};
  const addReply=(pid,content,images)=>{const wait=checkRate("reply");if(wait>0)return false;setLastPostTime(Date.now());const nr={id:"r"+Date.now(),author:user,content,images:images||[],time:"just now",likes:0,dislikes:0,_edited:false};setReps(r=>({...r,[pid]:[...(r[pid]||[]),nr]}));setPosts(ps=>ps.map(p=>p.id===pid?{...p,replies:p.replies+1}:p));return true};
  const deletePost=(pid)=>{setPosts(ps=>ps.filter(p=>p.id!==pid));setReps(r=>{const nr={...r};delete nr[pid];return nr});setDeleteConfirm(null);go("home")};
  const deleteReply=(pid,rid)=>{setReps(rp=>{const nr={};Object.entries(rp).forEach(([k,rs])=>{nr[k]=k===pid?rs.filter(r=>r.id!==rid):rs});return nr});setPosts(ps=>ps.map(p=>p.id===pid?{...p,replies:Math.max(0,p.replies-1)}:p));setDeleteConfirm(null)};
  const canPost=(f,s,l)=>{if(!user)return false;if(f==="national")return true;if(f==="state")return user.origin===s||user.residence===s;if(f==="lga")return user.lga===l||user.lgaResidence===l;return false};
  const toggleVote=(id,type,isReply)=>{const k=(isReply?"r_":"p_")+id;const cur=myVotes[k];
    if(cur===type){
      setMyVotes(v=>({...v,[k]:null}));
      if(isReply){setReps(rp=>{const nr={};Object.entries(rp).forEach(([pid,rs])=>{nr[pid]=rs.map(r=>r.id===id?{...r,[type==="like"?"likes":"dislikes"]:Math.max(0,r[type==="like"?"likes":"dislikes"]-1)}:r)});return nr})}
      else{setPosts(ps=>ps.map(p=>p.id===id?{...p,[type==="like"?"likes":"dislikes"]:Math.max(0,p[type==="like"?"likes":"dislikes"]-1)}:p))}
    }else{
      setMyVotes(v=>({...v,[k]:type}));
      if(isReply){setReps(rp=>{const nr={};Object.entries(rp).forEach(([pid,rs])=>{nr[pid]=rs.map(r=>{if(r.id!==id)return r;let up={...r};up[type==="like"?"likes":"dislikes"]=r[type==="like"?"likes":"dislikes"]+1;if(cur)up[cur==="like"?"likes":"dislikes"]=Math.max(0,r[cur==="like"?"likes":"dislikes"]-1);return up})});return nr})}
      else{setPosts(ps=>ps.map(p=>{if(p.id!==id)return p;let np={...p};np[type==="like"?"likes":"dislikes"]=p[type==="like"?"likes":"dislikes"]+1;if(cur)np[cur==="like"?"likes":"dislikes"]=Math.max(0,p[cur==="like"?"likes":"dislikes"]-1);return np}))}
    }};
  const toggleBk=(id)=>setBookmarks(b=>b.includes(id)?b.filter(x=>x!==id):[...b,id]);
  const toggleFollow=(uid)=>{setFollowing(f=>f.includes(uid)?f.filter(x=>x!==uid):[...f,uid])};
  const pollVote=(pid,optIdx)=>{setPosts(ps=>ps.map(p=>{if(p.id!==pid||!p.poll)return p;const np={...p,poll:{...p.poll,votes:[...p.poll.votes],voted:{...p.poll.voted}}};np.poll.votes[optIdx]++;np.poll.voted[user.id]=optIdx;return np}))};

  const eduLvl=useMemo(()=>{if(view==="lga")return"lga";if(view==="state")return"state";return"national"},[view]);
  const adScope=useMemo(()=>{if(view==="lga")return"lga_"+(vx.lga||user?.lga||"");if(view==="state")return"state_"+(vx.state||user?.origin||"");return"national"},[view,vx,user]);
  const cForum=view==="state"?"state":view==="lga"?"lga":"national";
  const cState=view==="state"?vx.state:user?.origin;const cLga=view==="lga"?vx.lga:user?.lga;
  const unreadN=notifs.filter(n=>!n.isRead).length;
  const unreadM=msgs.filter(m=>m.receiver?.id===user?.id&&!m.isRead).length;

  useEffect(()=>{if(!sdOpen&&!ndOpen)return;const h=()=>{setSdOpen(false);setNdOpen(false)};const t=setTimeout(()=>document.addEventListener("click",h),10);return()=>{clearTimeout(t);document.removeEventListener("click",h)}},[sdOpen,ndOpen]);
  // Ad expiry handled at render time in SmartCarousel (endDate > Date.now() check)

  const Header=()=><header className="hdr">
    <div className="hdr-logo" onClick={()=>go("home")}><svg viewBox="0 30 100 56" style={{width:32,height:18,flexShrink:0}} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision"><path d="M 28 78 A 22 22 0 0 1 72 78" fill="none" stroke="var(--grn)" strokeWidth="7" strokeLinecap="round"/><path d="M 18 78 A 32 32 0 0 1 82 78" fill="none" stroke="var(--grn)" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.55"/><path d="M 8 78 A 42 42 0 0 1 92 78" fill="none" stroke="var(--grn)" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.25"/><circle cx="50" cy="78" r="5" fill="#C9850A"/></svg><span style={{fontSize:13,fontWeight:800,letterSpacing:"0.06em",color:"var(--grn)",lineHeight:1}}>NAIRACLAN</span></div>
    {isIn&&<nav className="hdr-nav">{[["home","Home"],["state","State"],["lga","LGA"]].map(([v,l])=><button key={v} className={view===v||(view==="home"&&v==="home")?"on":""} onClick={()=>v==="state"?go("state",{state:user.origin}):v==="lga"?go("lga",{lga:user.lga,state:user.origin}):go(v)}>{l}</button>)}</nav>}
    <div className="hdr-r">
      <button className="ib" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}</button>
      {isIn?<>
        <div style={{position:"relative"}}><button className="ib" onClick={e=>{e.stopPropagation();setNdOpen(s=>!s);setSdOpen(false)}}><Bell size={15}/>{unreadN>0&&<span className="badge">{unreadN}</span>}</button>
          {ndOpen&&<div className="nd" onClick={e=>e.stopPropagation()}><div style={{padding:"12px 14px",fontWeight:700,fontSize:14,borderBottom:"1px solid var(--bdr)"}}>Notifications</div>{notifs.length===0?<div style={{padding:20,textAlign:"center",fontSize:13,color:"var(--txt3)"}}>No notifications</div>:notifs.map(n=><div key={n.id} className={`ni${!n.isRead?" unread":""}`} onClick={()=>{setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,isRead:true}:x));if(n.linkView)go(n.linkView,n.linkExtra||{});setNdOpen(false)}}><div><div className="ni-t">{n.title}</div>{n.body&&<div className="ni-b">{n.body}</div>}<div className="ni-tm">{n.time}</div></div></div>)}</div>}
        </div>
        <div style={{position:"relative"}}><button className="ib" onClick={e=>{e.stopPropagation();setSdOpen(s=>!s);setNdOpen(false)}}><Settings2 size={15}/></button>
          {sdOpen&&<div className="sd" onClick={e=>e.stopPropagation()}><div className="sd-i" onClick={()=>go("profile",{userId:user.id})}>👤 &nbsp;Profile</div><div className="sd-d"/><div className="sd-i" onClick={()=>go("guidelines")}>📜 &nbsp;Guidelines</div><div className="sd-d"/>
              <div className="sd-i" onClick={()=>go("civicedu")}>📚 &nbsp;Civic Education</div><div className="sd-d"/>
              <div className="sd-i" onClick={()=>go("leaders")}>🏛️ &nbsp;Know Your Leaders</div><div className="sd-d"/>
              {user&&(user.role==="admin"||user.role==="super_admin")&&<><div className="sd-i" onClick={()=>go("admin")} style={{color:"var(--grn)",fontWeight:600}}>🛡️ &nbsp;Admin Dashboard</div><div className="sd-d"/></>}<div className="sd-i dng" onClick={()=>{setUser(null);setSdOpen(false);go("home")}}>🚪 &nbsp;Sign Out</div></div>}
        </div>
      </>:<><button className="bg" onClick={()=>setModal("signin")}>Sign In</button><button className="bp" onClick={()=>setModal("register")}>Join</button></>}
    </div>
  </header>;

  const BNav=()=><nav className="bnav">{[["home","🏠","Home"],["state","🏛️","State"],["lga","🏘️","LGA"],["inbox","✉️","Messages"],["profile","👤","Profile"]].map(([v,ic,lb])=><button key={v} className={`bni${view===v?" on":""}`} onClick={()=>{if((v==="state"||v==="lga"||v==="inbox"||v==="profile")&&!isIn)setModal("signin");else if(v==="state"&&user)go("state",{state:user.origin});else if(v==="lga"&&user)go("lga",{lga:user.lga,state:user.origin});else if(v==="profile"&&user)go("profile",{userId:user.id});else go(v)}}><span className="bi">{ic}</span><span>{lb}</span></button>)}</nav>;

  const Hero=({forumType,forumLabel})=>{
    const headline=isIn?(
      forumType==="lga"?<h1>Welcome to <em>{forumLabel}</em> LGA Forum</h1>:
      forumType==="state"?<h1>Welcome to <em>{forumLabel}</em> State Forum</h1>:
      <h1>Nigeria's Premier <em>Civic Forum</em></h1>
    ):<h1>Nigeria needs <em>your Voice</em>.</h1>;
    return <div className="hero"><div className="hero-c">
      <div className="hl"><span className="hld"/>LIVE · 37 STATES · ACTIVE NOW</div>
      <LiveClock/>
      {headline}
      {!isIn&&<p className="hero-sub">Join your CLAN where politics can't ignore community voices.</p>}
      {!isIn&&<div className="hctas"><button className="bp" onClick={()=>setModal("register")}>Join Free</button><button className="bg" style={{color:"rgba(255,255,255,.7)",borderColor:"rgba(255,255,255,.2)"}} onClick={()=>setModal("signin")}>Sign In</button></div>}
      <div className="hs"><span><strong>12,450</strong> members</span><span><strong>3,200</strong> topics</span></div>
      <div className="hsrc"><span className="si">🔍</span><input placeholder="Search posts, members, topics…" onClick={()=>go("search")} readOnly/></div>
    </div></div>};

  /* ─── HOME ─── */
  const Home=()=><><Hero/><div className="fw"><SmartCarousel level="national" scope="national" ads={ads}/>{feed.length>0?feed.map(p=><PostCard key={p.id} post={p} onClick={()=>go("thread",{postId:p.id})}/>):<div className="empty"><div className="empty-ic">📭</div><p>No posts yet.</p></div>}</div></>;

  /* ─── FORUM ─── */
  const Forum=({type})=>{const fS=type==="state"?vx.state:user?.origin;const fL=type==="lga"?vx.lga:user?.lga;const cp=canPost(type,fS,fL);
    return <><Hero forumType={type} forumLabel={type==="state"?fS:type==="lga"?fL:"National"}/><div className="fw"><SmartCarousel level={type==="lga"?"lga":type==="state"?"state":"national"} scope={type==="national"?"national":type==="state"?"state_"+fS:"lga_"+fL} ads={ads}/>{type!=="national"&&<CatGrid cats={CATEGORIES} active={aCat} onSelect={setACat}/>}{feed.map(p=><PostCard key={p.id} post={p} onClick={()=>go("thread",{postId:p.id})}/>)}{feed.length===0&&<div className="empty"><div className="empty-ic">📭</div><p>No posts here yet.</p></div>}</div></>};

  /* ─── THREAD ─── */
  const isAdminRole=isIn&&(user.role==="admin"||user.role==="super_admin");
  const Thread=()=>{const post=posts.find(p=>p.id===vx.postId);const tr=reps[vx.postId]||[];const[mr,setMr]=useState(null);
    const[aiReplyLoading,setAiReplyLoading]=useState(false);
    const[aiPreview,setAiPreview]=useState(null);const[aiPreviewBot,setAiPreviewBot]=useState(null);
    const[quoteRef,setQuoteRef]=useState(null);
    const[editingPost,setEditingPost]=useState(false);const[editReplyId,setEditReplyId]=useState(null);
    const[replyPhotos,setReplyPhotos]=useState([]);const[rateMsg,setRateMsg]=useState("");
    const replyRef=useRef(null);const editRef=useRef(null);
    if(!post)return <div className="fw"><div className="empty"><p>Post not found.</p></div></div>;
    const pv=myVotes["p_"+post.id];const isBk=bookmarks.includes(post.id);const isMyPost=user&&user.id===post.author.id;
    const pq=(c)=>{const m=c.match(/^__QUOTE__:(.+?):(.+?):(.+?)__ENDQUOTE__\n\n([\s\S]*)$/);return m?{q:{a:m[1],id:m[2],sn:m[3]},b:m[4]}:{q:null,b:c}};
    const savePostEdit=()=>{const html=editRef.current?.innerHTML||"";if(!html.trim())return;setPosts(ps=>ps.map(p=>p.id===post.id?{...p,body:html,_edited:true}:p));setEditingPost(false)};
    const saveReplyEdit=(rid)=>{const html=editRef.current?.innerHTML||"";if(!html.trim())return;setReps(rp=>{const nr={};Object.entries(rp).forEach(([pid,rs])=>{nr[pid]=rs.map(r=>r.id===rid?{...r,content:html,_edited:true}:r)});return nr});setEditReplyId(null)};

    const generateAiReply=async()=>{
      setAiReplyLoading(true);setAiPreview(null);setAiPreviewBot(null);
      const r=await aiGenReply(post.title,post.body,post.state||"Nigeria");
      setAiReplyLoading(false);
      if(!r.ok){setAiPreview("Error: "+r.text);return}
      const txt=r.text.trim();
      if(txt==="SKIP"||txt.toLowerCase().includes("not relevant")){setAiPreview("__NOT_RELEVANT__");return}
      // Strip any accidental JSON that may have leaked
      let clean=txt.replace(/^\{[\s\S]*?\}\s*/,"").replace(/```[\s\S]*?```/g,"").trim();
      if(!clean)clean=txt;
      if(clean){const bot=getBot(post.state||user.origin);setAiPreview(clean);setAiPreviewBot(bot)}
    };
    const approveAiReply=()=>{
      if(!aiPreview||!aiPreviewBot)return;
      const nr={id:"r"+Date.now(),author:aiPreviewBot,content:aiPreview,time:"just now",likes:0,dislikes:0,_edited:false};
      setReps(rp=>({...rp,[post.id]:[...(rp[post.id]||[]),nr]}));
      setPosts(ps=>ps.map(p=>p.id===post.id?{...p,replies:p.replies+1}:p));
      logAction("AI reply",`@${aiPreviewBot.username} replied on: ${post.title.slice(0,40)}`);
      setAiPreview(null);setAiPreviewBot(null);
    };

    return <div className="fw">
      <div className="tp"><div className="tph"><Av name={post.author.username} size={42} src={post.author.avatar} onClick={()=>go("profile",{userId:post.author.id})}/><div className="tpi"><span className="tpu" onClick={()=>go("profile",{userId:post.author.id})}>{post.author.username}</span> <RB role={post.author.role}/><div className="tpd"><TP tag={post.tag} isB={post.isBreaking} isH={post.isHot}/>{post.state&&<span>{post.state}</span>}<span>·</span><span>{post.time}</span></div></div></div>
        <h1 className="tpt">{post.title}</h1>
        {(post.promotedTo||[]).length>0&&<div style={{marginBottom:8}}>{(post.promotedTo||[]).map(lvl=><span key={lvl} className="promo-badge">⬆ Promoted to {lvl==="state"?"State":"National"}</span>)}</div>}
        {editingPost?<div style={{margin:"10px 0"}}><RichCompose editorRef={editRef} placeholder="Edit post…"/><div style={{display:"flex",gap:6,marginTop:8}}><button className="bp" style={{fontSize:12,padding:"6px 14px"}} onClick={savePostEdit}>Save</button><button className="bg" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setEditingPost(false)}>Cancel</button></div></div>:<>
        <div className="tpbd" dangerouslySetInnerHTML={{__html:post.body}}/>
        {post._edited&&<span className="rced" style={{display:"inline-block",marginTop:4}}>(edited)</span>}
        {isMyPost&&<button style={{fontSize:11,color:"var(--txt3)",marginTop:6,fontWeight:600}} onClick={()=>{setEditingPost(true);setTimeout(()=>{if(editRef.current)editRef.current.innerHTML=post.body},50)}}>Edit post</button>}</>}
        {post.images&&post.images.length>0&&<div className={`post-imgs${post.images.length>1?" multi":""}`}>{post.images.map((img,i)=><img key={i} src={img} alt="" onClick={()=>window.open(img,"_blank")}/>)}</div>}
        {post.poll&&<PollBlock poll={post.poll} postId={post.id} userId={user?.id} onVote={pollVote}/>}
        <div className="tpa">
          <button className={`ab${pv==="like"?" liked":""}`} onClick={()=>isIn&&toggleVote(post.id,"like",false)}>👍 {post.likes}</button>
          <button className={`ab${pv==="dislike"?" disliked":""}`} onClick={()=>isIn&&toggleVote(post.id,"dislike",false)}>👎 {post.dislikes}</button>
          <button className={`ab${isBk?" bkd":""}`} onClick={()=>isIn&&toggleBk(post.id)}>{isBk?"🔖":"🔖"} {isBk?"Saved":"Bookmark"}</button>
          <button className="ab">📤 Share</button><button className="ab">🚩 Report</button>
          {canMod&&<button className="ab" style={{color:"var(--red)"}} onClick={()=>setDeleteConfirm({type:"post",id:post.id,title:post.title})}>🗑 Delete</button>}
          {canMod&&canPromote(post)&&<button className="ab" style={{color:"#f97316",fontWeight:600}} onClick={()=>promotePost(post.id,post.forum==="lga"?"state":"national")}>⬆ Promote to {post.forum==="lga"?"State":"National"}</button>}
          {isAdminRole&&<button className="ab" style={{color:"#7c3aed"}} disabled={aiReplyLoading} onClick={generateAiReply}>{aiReplyLoading?<><span className="ai-spin"/>Generating…</>:"🤖 AI Reply"}</button>}
        </div>
      </div>

      {/* AI Reply Preview — admin reviews before posting */}
      {aiPreview&&aiPreview==="__NOT_RELEVANT__"&&<div style={{background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.15)",borderRadius:14,padding:16,margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:"var(--red)",marginBottom:4}}>AI determined this post doesn't warrant a reply</div><div style={{fontSize:12,color:"var(--txt3)"}}>The content was not relevant enough for a citizen reply.</div><button className="bg" style={{fontSize:12,padding:"6px 12px",marginTop:8}} onClick={()=>setAiPreview(null)}>Dismiss</button></div>}

      {aiPreview&&aiPreview.startsWith("Error:")&&<div style={{background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.15)",borderRadius:14,padding:16,margin:"12px 0"}}><div className="mfl">{aiPreview}</div><button className="bg" style={{fontSize:12,padding:"6px 12px",marginTop:8}} onClick={()=>setAiPreview(null)}>Dismiss</button></div>}

      {aiPreview&&aiPreviewBot&&!aiPreview.startsWith("Error:")&&aiPreview!=="__NOT_RELEVANT__"&&<div style={{background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.2)",borderRadius:14,padding:16,margin:"12px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#7c3aed"}}>🤖 AI Reply Preview</div><span className="ai-tag">Review before posting</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><Av name={aiPreviewBot.username} size={28}/><span style={{fontSize:13,fontWeight:600}}>@{aiPreviewBot.username}</span><span style={{fontSize:11,color:"var(--txt3)"}}>{aiPreviewBot.origin} State</span></div>
        <div style={{fontSize:14,lineHeight:1.6,color:"var(--txt2)",padding:"10px 14px",background:"var(--bg2)",borderRadius:10,marginBottom:12,whiteSpace:"pre-wrap"}}>{aiPreview}</div>
        <div style={{display:"flex",gap:8}}><button className="bp" style={{fontSize:12,padding:"8px 18px"}} onClick={approveAiReply}>Post Reply</button><button className="bg" style={{fontSize:12,padding:"8px 14px"}} onClick={()=>{setAiPreview(null);setAiPreviewBot(null)}}>Discard</button><button className="bg" style={{fontSize:12,padding:"8px 14px"}} onClick={generateAiReply}>Regenerate</button></div>
      </div>}

      <div className="rh">💬 {tr.length} {tr.length===1?"Reply":"Replies"}</div>
      {tr.map(r=>{const{q,b}=pq(r.content);const rv=myVotes["r_"+r.id];const isMyReply=user&&user.id===r.author.id;const isEditing=editReplyId===r.id;return <div className="rc" key={r.id} id={`reply-${r.id}`}><div className="rct"><Av name={r.author.username} size={30} src={r.author.avatar}/><span className="rcu">{r.author.username}</span><RB role={r.author.role}/><span className="rctm">{r.time}</span>{r._edited&&<span className="rced">(edited)</span>}</div>{q&&<div className="rcq" onClick={()=>document.getElementById(`reply-${q.id}`)?.scrollIntoView({behavior:"smooth"})}><strong>↩ @{q.a}</strong><br/>{q.sn}</div>}
        {isEditing?<div style={{margin:"8px 0"}}><RichCompose editorRef={editRef} placeholder="Edit reply…"/><div style={{display:"flex",gap:6,marginTop:8}}><button className="bp" style={{fontSize:11,padding:"4px 12px"}} onClick={()=>saveReplyEdit(r.id)}>Save</button><button className="bg" style={{fontSize:11,padding:"4px 12px"}} onClick={()=>setEditReplyId(null)}>Cancel</button></div></div>:<><div className="rcbd" dangerouslySetInnerHTML={{__html:b}}/>{r.images&&r.images.length>0&&<div className={`post-imgs${r.images.length>1?" multi":""}`} style={{marginTop:6}}>{r.images.map((img,j)=><img key={j} src={img} alt="" style={{maxHeight:180}} onClick={()=>window.open(img,"_blank")}/>)}</div>}</>}
        <div className="rca"><button className={`ab${rv==="like"?" liked":""}`} style={{fontSize:11}} onClick={()=>isIn&&toggleVote(r.id,"like",true)}>👍 {r.likes}</button><button className={`ab${rv==="dislike"?" disliked":""}`} style={{fontSize:11}} onClick={()=>isIn&&toggleVote(r.id,"dislike",true)}>👎 {r.dislikes}</button><button className="ab" style={{fontSize:11}} onClick={()=>{if(!isIn)return;setQuoteRef({author:r.author.username,id:r.id,snippet:stripHtml(b||r.content).slice(0,80)});setTimeout(()=>replyRef.current?.focus(),100)}}>💬 Quote</button>{isMyReply&&!isEditing&&<button className="ab" style={{fontSize:11,color:"var(--txt3)"}} onClick={()=>{setEditReplyId(r.id);setTimeout(()=>{if(editRef.current)editRef.current.innerHTML=b||r.content},50)}}>✏️ Edit</button>}{canMod&&<button className="ab" style={{fontSize:11,color:"var(--red)"}} onClick={()=>setDeleteConfirm({type:"reply",postId:post.id,id:r.id,title:stripHtml(b||r.content).slice(0,50)})}>🗑</button>}</div></div>})}
      {isIn?<div className="cmp">
        {quoteRef&&<div className="quote-box"><div><strong>↩ @{quoteRef.author}</strong><br/>{quoteRef.snippet}{quoteRef.snippet.length>=80?"…":""}</div><button style={{fontSize:14,color:"var(--txt3)",flexShrink:0,padding:"2px 6px"}} onClick={()=>setQuoteRef(null)}>✕</button></div>}
        <RichCompose editorRef={replyRef} placeholder={quoteRef?`Reply to @${quoteRef.author}…`:"Write a reply…"} photos={replyPhotos} setPhotos={setReplyPhotos}/>
        {rateMsg&&<div className="rate-msg">{rateMsg}</div>}
        <div className="cmpb"><div>{mr&&!mr.ok&&<div className="mfl">🛡️ {mr.r}</div>}</div><button className="bp" style={{padding:"8px 20px",fontSize:13}} onClick={()=>{const txt=replyRef.current?.innerText?.trim()||"";const html=replyRef.current?.innerHTML||"";if(!txt)return;const wait=checkRate("reply");if(wait>0){setRateMsg(`Please wait ${wait}s before replying again.`);setTimeout(()=>setRateMsg(""),3000);return}const c=nMod(txt,post.category);if(!c.ok){setMr(c);return}const content=quoteRef?`__QUOTE__:${quoteRef.author}:${quoteRef.id}:${quoteRef.snippet}__ENDQUOTE__\n\n${html}`:html;const ok=addReply(post.id,content,replyPhotos);if(ok!==false){if(replyRef.current)replyRef.current.innerHTML="";setMr(null);setQuoteRef(null);setReplyPhotos([])}}}>Reply</button></div>
      </div>:<div style={{textAlign:"center",padding:"24px 0"}}><p style={{fontSize:14,color:"var(--txt3)",marginBottom:12}}>Join the conversation</p><button className="bp" onClick={()=>setModal("register")}>Join NairaClan</button><span style={{margin:"0 8px",color:"var(--txt3)",fontSize:13}}>or</span><button className="bg" onClick={()=>setModal("signin")}>Sign In</button></div>}
    </div>};

  /* ─── PROFILE ─── */
  const Profile=()=>{const uid=vx.userId;const pu=MU.find(u=>u.id===uid)||(user?.id===uid?user:null);
    if(!pu)return <div className="fw"><div className="empty"><p>User not found.</p></div></div>;
    const isOwn=user&&user.id===pu.id;const isFlw=following.includes(pu.id);
    const userPosts=posts.filter(p=>p.author.id===pu.id);
    const[editBio,setEditBio]=useState(false);const[bio,setBio]=useState(pu.bio||"");
    const avatarRef=useRef(null);
    const handleAvatarUpload=(e)=>{const f=e.target.files?.[0];if(!f||f.size>5*1024*1024||!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=()=>{pu.avatar=r.result;if(isOwn)setUser(u=>({...u,avatar:r.result}))};r.readAsDataURL(f);e.target.value=""};
    // Compute followers & following lists
    const followerIds=isOwn?MU.filter(u=>u.id!==pu.id).slice(0,pu.followers).map(u=>u.id).concat(following.includes(pu.id)?[]:[]):MU.filter(u=>u.id!==pu.id).slice(0,pu.followers).map(u=>u.id);
    const followingIds=isOwn?following:MU.filter(u=>u.id!==pu.id).slice(0,pu.following).map(u=>u.id);
    const followerUsers=MU.filter(u=>followerIds.includes(u.id));
    const followingUsers=MU.filter(u=>followingIds.includes(u.id));
    return <div className="fw"><div className="prof-hd">
      <div style={{position:"relative",width:80,height:80,margin:"0 auto 12px"}}>
        {pu.avatar?<img src={pu.avatar} alt="" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover"}}/>:<div className="prof-av" style={{background:gc(pu.username),width:80,height:80,fontSize:28,margin:0}}>{gi(pu.username)}</div>}
        {isOwn&&<><input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{display:"none"}}/><button onClick={()=>avatarRef.current?.click()} style={{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:14,background:"var(--grn)",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid var(--bg1)",cursor:"pointer"}}>📷</button></>}
      </div>
      <div className="prof-name">{pu.name||pu.username}</div>
      <div className="prof-un">@{pu.username}</div>
      {pu.title&&<div className="prof-title">{pu.title}</div>}
      {editBio?<div style={{maxWidth:300,margin:"0 auto"}}><textarea value={bio} onChange={e=>setBio(e.target.value)} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid var(--bdr)",background:"var(--bg2)",color:"var(--txt)",fontSize:13,minHeight:60,outline:"none",resize:"vertical"}}/><div style={{display:"flex",gap:6,justifyContent:"center",marginTop:6}}><button className="bp" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{pu.bio=bio;setEditBio(false)}}>Save</button><button className="bg" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setEditBio(false)}>Cancel</button></div></div>:<div className="prof-bio">{pu.bio||"No bio yet."}{isOwn&&<button style={{fontSize:11,color:"var(--grn)",fontWeight:600,marginLeft:6}} onClick={()=>setEditBio(true)}>Edit</button>}</div>}
      <div className="prof-loc"><span>📍 {pu.lga}, {pu.origin}</span><span>🏠 {pu.lgaResidence}, {pu.residence}</span></div>
      <div className="prof-stats">
        <div style={{cursor:"pointer"}} onClick={()=>setProfTab("posts")}><strong>{userPosts.length}</strong><span>Posts</span></div>
        <div style={{cursor:"pointer"}} onClick={()=>setProfTab("followers")}><strong>{followerUsers.length+(isFlw?1:0)}</strong><span>Followers</span></div>
        <div style={{cursor:"pointer"}} onClick={()=>setProfTab("following")}><strong>{followingUsers.length}</strong><span>Following</span></div>
      </div>
      {!isOwn&&isIn&&<div className="prof-actions"><button className={isFlw?"bg":"bp"} style={{padding:"8px 24px"}} onClick={()=>toggleFollow(pu.id)}>{isFlw?"Unfollow":"Follow"}</button><button className="bg" style={{padding:"8px 16px"}} onClick={()=>{go("inbox");setInboxTab("compose")}}>Message</button></div>}
      {isOwn&&<div className="prof-strikes" title={`${pu.strikes} strike${pu.strikes!==1?"s":""}`}>{[0,1,2].map(i=><div key={i} className={`strike-dot${i<pu.strikes?" active":""}`}/>)}</div>}
    </div>
    <div style={{padding:"0 12px"}}>
      <div className="tabs">
        <button className={`tab${profTab==="posts"?" on":""}`} onClick={()=>setProfTab("posts")}>Posts</button>
        <button className={`tab${profTab==="followers"?" on":""}`} onClick={()=>setProfTab("followers")}>Followers</button>
        <button className={`tab${profTab==="following"?" on":""}`} onClick={()=>setProfTab("following")}>Following</button>
        {isOwn&&<button className={`tab${profTab==="bookmarks"?" on":""}`} onClick={()=>setProfTab("bookmarks")}>Bookmarks</button>}
      </div>
      {profTab==="posts"&&(userPosts.length>0?userPosts.map(p=><PostCard key={p.id} post={p} onClick={()=>go("thread",{postId:p.id})}/>):<div className="empty"><p>No posts yet.</p></div>)}
      {profTab==="followers"&&(followerUsers.length>0?followerUsers.map(u=><div key={u.id} className="member-card" onClick={()=>go("profile",{userId:u.id})}><Av name={u.username} size={40} src={u.avatar}/><div className="mc-info"><div className="mc-name">{u.username} <RB role={u.role}/></div><div className="mc-meta">{u.origin} · {u.posts} posts</div></div>{isIn&&u.id!==user.id&&<button className={following.includes(u.id)?"bg":"bp"} style={{fontSize:11,padding:"4px 12px",flexShrink:0}} onClick={e=>{e.stopPropagation();toggleFollow(u.id)}}>{following.includes(u.id)?"Unfollow":"Follow"}</button>}</div>):<div className="empty"><p>No followers yet.</p></div>)}
      {profTab==="following"&&(followingUsers.length>0?followingUsers.map(u=><div key={u.id} className="member-card" onClick={()=>go("profile",{userId:u.id})}><Av name={u.username} size={40} src={u.avatar}/><div className="mc-info"><div className="mc-name">{u.username} <RB role={u.role}/></div><div className="mc-meta">{u.origin} · {u.posts} posts</div></div>{isIn&&u.id!==user.id&&<button className="bg" style={{fontSize:11,padding:"4px 12px",flexShrink:0}} onClick={e=>{e.stopPropagation();toggleFollow(u.id)}}>{following.includes(u.id)?"Unfollow":"Follow"}</button>}</div>):<div className="empty"><p>Not following anyone yet.</p></div>)}
      {profTab==="bookmarks"&&(bookmarks.length>0?posts.filter(p=>bookmarks.includes(p.id)).map(p=><PostCard key={p.id} post={p} onClick={()=>go("thread",{postId:p.id})}/>):<div className="empty"><p>No bookmarks yet.</p></div>)}
    </div></div>};

  /* ─── INBOX ─── */
  const Inbox=()=>{const[compTo,setCompTo]=useState("");const[compSubj,setCompSubj]=useState("");
    const[openMsg,setOpenMsg]=useState(null);const msgRef=useRef(null);
    const received=msgs.filter(m=>m.receiver?.id===user?.id).sort((a,b)=>b.time?.localeCompare?.(a.time));
    const sent=msgs.filter(m=>m.sender?.id===user?.id);
    const openMessage=(m,isSent)=>{setMsgs(ms=>ms.map(x=>x.id===m.id?{...x,isRead:true}:x));setOpenMsg({...m,isSent})};

    if(openMsg)return <div className="fw" style={{paddingTop:16}}>
      <button className="tb" onClick={()=>setOpenMsg(null)}>← Back to Inbox</button>
      <div style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:14,padding:16,marginTop:8}}>
        <div style={{fontSize:16,fontWeight:800,marginBottom:8}}>{openMsg.subject}</div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12,paddingBottom:12,borderBottom:"1px solid var(--bdr)"}}>
          <Av name={openMsg.isSent?openMsg.receiver.username:openMsg.sender.username} size={36}/>
          <div><div style={{fontSize:13,fontWeight:600}}>{openMsg.isSent?"To: @"+openMsg.receiver.username:"From: @"+openMsg.sender.username}</div><div style={{fontSize:11,color:"var(--txt3)"}}>{openMsg.time}</div></div>
        </div>
        <div style={{fontSize:14,lineHeight:1.7,color:"var(--txt2)"}} dangerouslySetInnerHTML={{__html:openMsg.body}}/>
        {!openMsg.isSent&&<button className="bp" style={{marginTop:16,fontSize:13,padding:"8px 20px"}} onClick={()=>{setOpenMsg(null);setInboxTab("compose");setCompTo(openMsg.sender.username)}}>Reply</button>}
      </div>
    </div>;

    return <div className="fw" style={{paddingTop:16}}><h2 style={{fontSize:18,fontWeight:800,letterSpacing:"-.02em",marginBottom:12}}>Inbox</h2>
      <div className="tabs"><button className={`tab${inboxTab==="received"?" on":""}`} onClick={()=>setInboxTab("received")}>Received{unreadM>0?` (${unreadM})`:""}</button><button className={`tab${inboxTab==="sent"?" on":""}`} onClick={()=>setInboxTab("sent")}>Sent</button><button className={`tab${inboxTab==="compose"?" on":""}`} onClick={()=>setInboxTab("compose")}>Compose</button></div>
      {inboxTab==="received"&&(received.length>0?received.map(m=>{const prev=stripHtml(m.body);return <div key={m.id} className={`msg-item${!m.isRead?" msg-unread":""}`} onClick={()=>openMessage(m,false)}><Av name={m.sender.username} size={36} src={m.sender.avatar}/><div className="msg-body"><div className="msg-subj">{m.subject}</div><div className="msg-prev">{m.sender.username}: {prev.slice(0,60)}{prev.length>60?"…":""}</div></div><span className="msg-tm">{m.time}</span></div>}):<div className="empty"><p>No messages.</p></div>)}
      {inboxTab==="sent"&&(sent.length>0?sent.map(m=>{const prev=stripHtml(m.body);return <div key={m.id} className="msg-item" onClick={()=>openMessage(m,true)}><Av name={m.receiver.username} size={36} src={m.receiver.avatar}/><div className="msg-body"><div className="msg-subj">{m.subject}</div><div className="msg-prev">To {m.receiver.username}: {prev.slice(0,60)}{prev.length>60?"…":""}</div></div><span className="msg-tm">{m.time}</span></div>}):<div className="empty"><p>No sent messages.</p></div>)}
      {inboxTab==="compose"&&<div style={{paddingTop:14}}><div className="fld"><label>To (username)</label><input value={compTo} onChange={e=>setCompTo(e.target.value)} placeholder="Enter username"/></div><div className="fld"><label>Subject</label><input value={compSubj} onChange={e=>setCompSubj(e.target.value)} placeholder="Message subject"/></div><div className="fld"><label>Message</label><RichCompose editorRef={msgRef} placeholder="Write your message…" minH="100px"/></div><button className="bp" onClick={()=>{const body=msgRef.current?.innerText?.trim()||"";if(!compTo.trim()||!compSubj.trim()||!body)return;const to=MU.find(u=>u.username.toLowerCase()===compTo.toLowerCase());if(!to)return;setMsgs(m=>[{id:"m"+Date.now(),sender:user,receiver:to,subject:compSubj,body:msgRef.current?.innerHTML||body,isRead:false,time:"just now"},...m]);setCompTo("");setCompSubj("");if(msgRef.current)msgRef.current.innerHTML="";setInboxTab("sent")}} disabled={!compTo.trim()||!compSubj.trim()}>Send Message</button></div>}
    </div>};

  /* ─── SEARCH ─── */
  const Search=()=>{const q=searchQ.toLowerCase();
    const scopedPosts=isIn?posts.filter(p=>p.forum==="national"||(p.state&&(p.state===user.origin||p.state===user.residence))||(p.lga&&(p.lga===user.lga||p.lga===user.lgaResidence))):posts.filter(p=>p.forum==="national");
    const rPosts=q?scopedPosts.filter(p=>p.title.toLowerCase().includes(q)||stripHtml(p.body).toLowerCase().includes(q)):[];
    const rUsers=q?MU.filter(u=>u.username.toLowerCase().includes(q)||u.name.toLowerCase().includes(q)):[];
    const scopeLabel=isIn?`Searching National, ${user.origin} State, and ${user.lga} LGA forums`:"Searching National forum only";
    return <div className="fw" style={{paddingTop:8}}><div style={{position:"relative"}}><span style={{position:"absolute",left:14,top:28,fontSize:16,color:"var(--txt3)",pointerEvents:"none"}}>🔍</span><input className="srch-input" style={{paddingLeft:42}} value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search posts, members…" autoFocus/></div>
      <div style={{fontSize:11,color:"var(--txt3)",padding:"4px 0 8px"}}>{scopeLabel}</div>
      <div className="tabs"><button className={`tab${searchTab==="posts"?" on":""}`} onClick={()=>setSearchTab("posts")}>Posts{q?` (${rPosts.length})`:""}</button><button className={`tab${searchTab==="members"?" on":""}`} onClick={()=>setSearchTab("members")}>Members{q?` (${rUsers.length})`:""}</button></div>
      {!q&&<div className="empty"><div className="empty-ic">🔍</div><p>Type to search…</p></div>}
      {q&&searchTab==="posts"&&(rPosts.length>0?rPosts.map(p=><PostCard key={p.id} post={p} onClick={()=>go("thread",{postId:p.id})}/>):<div className="empty"><p>No posts found.</p></div>)}
      {q&&searchTab==="members"&&(rUsers.length>0?rUsers.map(u=><div key={u.id} className="member-card" onClick={()=>go("profile",{userId:u.id})}><Av name={u.username} size={40} src={u.avatar}/><div className="mc-info"><div className="mc-name">{u.username} <RB role={u.role}/></div><div className="mc-meta">{u.origin} · {u.posts} posts</div></div></div>):<div className="empty"><p>No members found.</p></div>)}
    </div>};

  const issueStrike=(uid,reason)=>{const u=MU.find(x=>x.id===uid);if(!u)return;u.strikes=Math.min(3,u.strikes+1);if(u.strikes>=3)u.status="suspended";setActLog(l=>[{id:"al"+Date.now(),actor:user.username,action:"Issued strike",detail:`Strike ${u.strikes} to ${u.username}: ${reason}`,time:"just now"},...l]);if(user.id===uid)setUser({...user,strikes:u.strikes,status:u.status})};
  const logAction=(action,detail)=>setActLog(l=>[{id:"al"+Date.now(),actor:user?.username||"System",action,detail,time:"just now"},...l]);
  const getBot=(state)=>{if(!botStates[state])return user;const pool=BOT_USERS[state]||[];const active=pool.filter(b=>b.botActive);return active.length>0?active[Math.floor(Math.random()*active.length)]:user};

  /* ─── ADMIN DASHBOARD ─── */
  const Admin=()=>{
    const[moreOpen,setMoreOpen]=useState(false);
    const[userQ,setUserQ]=useState("");const[strikeModal,setStrikeModal]=useState(null);const[strikeReason,setStrikeReason]=useState("Ethnic hate speech");
    const[newAdTitle,setNewAdTitle]=useState("");const[newAdDays,setNewAdDays]=useState(14);
    const[newAdImg,setNewAdImg]=useState("");const[newAdLink,setNewAdLink]=useState("");
    const[adTargetType,setAdTargetType]=useState("national");const[adTargetState,setAdTargetState]=useState("");const[adTargetLga,setAdTargetLga]=useState("");const[adIncNat,setAdIncNat]=useState(false);
    const[announceText,setAnnounceText]=useState("");
    const[botFilter,setBotFilter]=useState("");
    const[aiState,setAiState]=useState("");const[aiLoading,setAiLoading]=useState(false);const[aiHeadlines,setAiHeadlines]=useState([]);const[aiResults,setAiResults]=useState([]);const[aiSeedTarget,setAiSeedTarget]=useState("Lagos");const[sweepResults,setSweepResults]=useState(null);
    const loadAiCache=(target)=>{const c=aiCacheGet(target);if(c){setAiHeadlines(c.headlines||[]);setAiResults(c.results||[]);setAiState(c.headlines?.length||c.results?.length?`Loaded ${(c.headlines||[]).length} headlines, ${(c.results||[]).length} articles for ${target}`:"");}else{setAiHeadlines([]);setAiResults([]);setAiState("")}};
    const saveAiCache=(target,headlines,results)=>{aiCacheSet(target,{headlines,results})};
    const[promoteUser,setPromoteUser]=useState("");const[promoteRole,setPromoteRole]=useState("lga_mod");const[promoteScope,setPromoteScope]=useState("");
    const isAdmin=user&&(user.role==="admin"||user.role==="super_admin");
    const aTab=admTab;const setATab=setAdmTab;

    const mainTabs=[["overview","📊","Overview"],["reports","🚩","Reports"],["users","👥","Users"],["ads","📢","Ads"],["team","🛡️","Team"]];
    const moreTabs=[["ai","🤖","AI Features"],["bots","👥","Bot Users"],["activeads","⏱️","Active Ads"],["announce","📣","Announce"],["log","📋","Activity Log"],["settings","⚙️","Settings"],["forums","🏛️","Forums"]];
    const fmtCd=(ms)=>{if(ms<=0)return"Expired";const d=Math.floor(ms/86400000);const h=Math.floor((ms%86400000)/3600000);const m=Math.floor((ms%3600000)/60000);return d>0?`${d}d ${h}h`:h>0?`${h}h ${m}m`:`${m}m`};

    const pendingReports=reports.filter(r=>r.status==="pending");
    const activeAds=ads.filter(a=>a.status==="active"&&a.endDate>Date.now());
    const filteredUsers=userQ?MU.filter(u=>u.username.toLowerCase().includes(userQ.toLowerCase())||u.email?.toLowerCase().includes(userQ.toLowerCase())):MU;

    const mainTabIds=["overview","reports","users","ads","team"];
    const isMainTab=mainTabIds.includes(aTab);

    return <div className="adm"><div className="adm-hdr"><h2>{isMainTab?"Admin Dashboard":moreTabs.find(t=>t[0]===aTab)?.[2]||"Admin"}</h2>{isMainTab?<button className="bg" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>go("home")}>← Exit</button>:<button className="bg" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setATab("overview")}>← Back</button>}</div>
      <div className="adm-content">
        {aTab==="overview"&&<><div className="stat-grid"><div className="stat-card"><strong>{MU.length}</strong><span>Total Members</span></div><div className="stat-card"><strong>{posts.length}</strong><span>Total Posts</span></div><div className="stat-card"><strong>{Object.values(reps).flat().length}</strong><span>Total Replies</span></div><div className="stat-card"><strong style={{color:"var(--red)"}}>{pendingReports.length}</strong><span>Pending Reports</span></div></div><div className="fh">📋 Recent Activity</div>{actLog.slice(0,8).map(l=><div key={l.id} className="log-row"><span className="log-actor">{l.actor}</span><span className="log-action">{l.action} — {l.detail}</span><span className="log-time">{l.time}</span></div>)}</>}

        {aTab==="reports"&&<><div className="fh">🚩 Pending Reports ({pendingReports.length})</div>{pendingReports.length===0&&<div className="empty"><p>No pending reports.</p></div>}{pendingReports.map(r=>{const rAuthor=MU.find(u=>u.username===r.author);return <div key={r.id} className="rpt-card">
          <div className="rpt-hd"><span className="rpt-title" style={{cursor:"pointer",textDecoration:"underline",textDecorationColor:"var(--bdr)"}} onClick={()=>go("thread",{postId:r.postId})}>{r.postTitle}</span><span className="rpt-sev" style={{background:r.severity==="high"?"rgba(220,38,38,.15)":r.severity==="medium"?"rgba(234,88,12,.12)":"var(--gd)",color:r.severity==="high"?"var(--red)":r.severity==="medium"?"#f97316":"var(--grn)"}}>{r.severity}</span></div>
          <div className="rpt-meta">By <span style={{color:"var(--grn)",cursor:"pointer",fontWeight:600}} onClick={()=>{if(rAuthor)go("profile",{userId:rAuthor.id})}}>@{r.author}</span> · Reported by @{r.reportedBy} · {r.reason}{r.count>1?` (×${r.count})`:""} · {r.time}</div>
          {r.detail&&<div style={{fontSize:12,color:"var(--txt3)",marginBottom:8}}>"{r.detail}"</div>}
          <div style={{display:"flex",gap:6,marginBottom:8}}><button className="bg" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>go("thread",{postId:r.postId})}>View Post</button>{rAuthor&&<button className="bg" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>go("profile",{userId:rAuthor.id})}>View Author</button>}</div>
          <div className="rpt-actions"><button className="bp" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{setReports(rs=>rs.map(x=>x.id===r.id?{...x,status:"resolved"}:x));logAction("Resolved report",r.postTitle)}}>Remove Post</button><button className="bg" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setReports(rs=>rs.map(x=>x.id===r.id?{...x,status:"dismissed"}:x))}>Dismiss</button><button style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,color:"var(--red)",background:"rgba(220,38,38,.08)"}} onClick={()=>setStrikeModal(r.author)}>Issue Strike</button></div>
        </div>})}</>}

        {aTab==="users"&&<><div className="fld" style={{margin:"12px 0"}}><input value={userQ} onChange={e=>setUserQ(e.target.value)} placeholder="Search users by username or email…"/></div>{filteredUsers.map(u=><div key={u.id} className="usr-row"><Av name={u.username} size={36} src={u.avatar}/><div className="usr-info"><div className="usr-name">{u.username} <RB role={u.role}/>{u.status==="suspended"&&<span style={{fontSize:10,color:"var(--red)",fontWeight:700,marginLeft:4}}>SUSPENDED</span>}</div><div className="usr-meta">{u.email} · {u.origin} · {u.strikes} strike{u.strikes!==1?"s":""}</div></div><div className="usr-actions"><button className="bg" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>go("profile",{userId:u.id})}>View</button><button style={{fontSize:11,padding:"4px 10px",borderRadius:8,fontWeight:600,color:"var(--red)"}} onClick={()=>setStrikeModal(u.username)}>Strike</button></div></div>)}</>}

        {aTab==="team"&&<><div className="fh">🛡️ Mod Team ({team.length})</div>{team.map(t=><div key={t.id} className="team-card"><div className="team-info"><div className="team-name">{t.username} <RB role={t.role}/></div><div className="team-role">{t.role.replace("_"," ")}</div><div className="team-scope">{t.assignedStates.length>0?"States: "+t.assignedStates.join(", "):""}{t.assignedLgas.length>0?"LGAs: "+t.assignedLgas.join(", "):""}</div></div><button className="bg" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>{const u=MU.find(x=>x.id===t.userId);if(u)u.role="member";setTeam(ts=>ts.filter(x=>x.id!==t.id));logAction("Demoted","Demoted "+t.username+" to member")}}>Demote</button></div>)}
          <div style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:14,padding:16,marginTop:14}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Promote User</div><div className="fld"><label>Username</label><input value={promoteUser} onChange={e=>setPromoteUser(e.target.value)} placeholder="Enter username"/></div><div className="fld"><label>Role</label><select value={promoteRole} onChange={e=>setPromoteRole(e.target.value)}><option value="lga_mod">LGA Mod</option><option value="state_mod">State Mod</option><option value="admin">Admin</option></select></div><div className="fld"><label>{promoteRole==="lga_mod"?"Assign LGA":"Assign State"}</label><input value={promoteScope} onChange={e=>setPromoteScope(e.target.value)} placeholder={promoteRole==="lga_mod"?"LGA name":"State name"}/></div><button className="bp" style={{fontSize:13}} onClick={()=>{const u=MU.find(x=>x.username.toLowerCase()===promoteUser.toLowerCase());if(!u)return;u.role=promoteRole;const nt={id:"tm"+Date.now(),userId:u.id,username:u.username,role:promoteRole,assignedStates:promoteRole!=="lga_mod"?[promoteScope]:[],assignedLgas:promoteRole==="lga_mod"?[promoteScope]:[]};setTeam(t=>[...t,nt]);logAction("Promoted user",`${u.username} → ${promoteRole} (${promoteScope})`);setPromoteUser("");setPromoteScope("")}}>Promote</button></div></>}

        {aTab==="ads"&&(()=>{
          const buildScopes=()=>{const s=[];if(adTargetType==="national"){s.push("national")}else if(adTargetType==="state"&&adTargetState){s.push("state_"+adTargetState);if(adIncNat)s.push("national")}else if(adTargetType==="lga"&&adTargetLga){s.push("lga_"+adTargetLga);if(adIncNat)s.push("national")}return s};
          const curScopes=buildScopes();
          const lgasForState=NIGERIA_STATE_LGAS[adTargetState]||[];
          const handleImgFile=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setNewAdImg(r.result);r.readAsDataURL(f)};
          return <><div className="fh">📢 Ad Banner Management</div>
          <div style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:14,padding:16}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Create New Ad Banner</div>
            <div className="fld"><label>Banner Title</label><input value={newAdTitle} onChange={e=>setNewAdTitle(e.target.value)} placeholder="e.g. MTN Nigeria — Connect Better"/></div>

            <div className="fld"><label>Banner Image</label>
              <div style={{fontSize:11,color:"var(--txt3)",marginBottom:6}}>Recommended: 728 × 90px (leaderboard) or 600 × 200px (wide). Max 2MB. PNG, JPG, or WebP.</div>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImgFile} style={{fontSize:13,padding:8,width:"100%",background:"var(--bg2)",border:"1px solid var(--bdr)",borderRadius:10,color:"var(--txt)"}}/>
              {newAdImg&&<div style={{marginTop:8,borderRadius:10,overflow:"hidden",border:"1px solid var(--bdr)",position:"relative"}}><img src={newAdImg} alt="Preview" style={{width:"100%",height:120,objectFit:"cover",display:"block"}}/><button style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:12,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setNewAdImg("")}>×</button></div>}
            </div>

            <div className="fld"><label>Click-through URL</label><input value={newAdLink} onChange={e=>setNewAdLink(e.target.value)} placeholder="https://sponsor-website.com"/></div>

            <div className="fld"><label>Target Placement</label>
              <select value={adTargetType} onChange={e=>{setAdTargetType(e.target.value);setAdTargetState("");setAdTargetLga("");setAdIncNat(false)}} style={{marginBottom:8}}>
                <option value="national">🇳🇬 National Forum</option>
                <option value="state">🏛️ Specific State</option>
                <option value="lga">🏘️ Specific LGA</option>
              </select>

              {(adTargetType==="state"||adTargetType==="lga")&&<><div className="fld" style={{marginBottom:8}}><label style={{fontSize:12}}>State</label><select value={adTargetState} onChange={e=>{setAdTargetState(e.target.value);setAdTargetLga("")}}><option value="">— Select state —</option>{ALL_STATES.map(s=><option key={s}>{s}</option>)}</select></div></>}

              {adTargetType==="lga"&&adTargetState&&<div className="fld" style={{marginBottom:8}}><label style={{fontSize:12}}>LGA in {adTargetState}</label><select value={adTargetLga} onChange={e=>setAdTargetLga(e.target.value)}><option value="">— Select LGA —</option>{lgasForState.map(lg=><option key={lg}>{lg}</option>)}</select></div>}

              {adTargetType!=="national"&&<label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--txt2)",cursor:"pointer"}}><input type="checkbox" checked={adIncNat} onChange={e=>setAdIncNat(e.target.checked)}/> Also display in National forum</label>}
            </div>

            <div className="fld"><label>Duration</label><select value={newAdDays} onChange={e=>setNewAdDays(+e.target.value)}>{[7,14,30,60,90].map(d=><option key={d} value={d}>{d} days — ₦{(d*1000).toLocaleString()}</option>)}</select></div>

            {curScopes.length>0&&<div style={{background:"var(--bg2)",borderRadius:10,padding:12,margin:"12px 0",fontSize:12,lineHeight:1.6}}>
              <strong style={{color:"var(--txt)"}}>Will display in: </strong>
              <span style={{color:"var(--txt2)"}}>{curScopes.map(s=>s==="national"?"🇳🇬 National":s.startsWith("state_")?"🏛️ "+s.replace("state_","")+" State":"🏘️ "+s.replace("lga_","")+" LGA").join(" · ")}</span>
              <div style={{color:"var(--txt3)",marginTop:4}}>Max 6 banners per forum · auto-swipe carousel</div>
            </div>}

            <button className="bp" style={{fontSize:13,width:"100%"}} disabled={!newAdTitle.trim()||curScopes.length===0} onClick={()=>{setAds(a=>[...a,{id:"ad"+Date.now(),scopes:curScopes,imgUrl:newAdImg,title:newAdTitle,linkUrl:newAdLink||"#",status:"active",endDate:Date.now()+newAdDays*86400000}]);logAction("Activated ad",`${newAdTitle} (${curScopes.join(", ")}, ${newAdDays}d)`);setNewAdTitle("");setNewAdImg("");setNewAdLink("");setAdTargetType("national");setAdTargetState("");setAdTargetLga("");setAdIncNat(false)}}>Activate Banner</button>
          </div>

          {ads.length>0&&<><div style={{fontSize:13,fontWeight:700,marginTop:20,marginBottom:8}}>All Banners ({ads.length})</div>{ads.map(a=>{const sc=a.scopes||[a.scope];return <div key={a.id} style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:12,padding:12,marginBottom:8}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:6}}>
              {a.imgUrl?<img src={a.imgUrl} style={{width:60,height:40,objectFit:"cover",borderRadius:8,flexShrink:0}} alt="" onError={e=>{e.target.style.display="none"}}/>:<div style={{width:60,height:40,borderRadius:8,background:"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"var(--txt3)",flexShrink:0}}>No img</div>}
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div><div style={{fontSize:11,color:"var(--txt3)"}}>{a.status} · {sc.length} scope{sc.length!==1?"s":""} · {a.linkUrl!=="#"?a.linkUrl.slice(0,30)+"…":"No link"}</div></div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{sc.map((s,i)=><span key={i} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--bg2)",color:"var(--txt3)"}}>{s==="national"?"🇳🇬 National":s.startsWith("state_")?"🏛️ "+s.replace("state_",""):"🏘️ "+s.replace("lga_","")}</span>)}</div>
          </div>})}</>}
        </>})()}

        {aTab==="ai"&&<><div className="fh">🤖 AI Features</div>
          <div className="ai-box"><h3>📰 AI Post Seeding</h3><p style={{fontSize:12,color:"var(--txt3)",marginBottom:12}}>Step 1: Fetch today's headlines. Step 2: Select a headline and AI writes the full article. Only News category. Access: Super Admin + Admin only.</p>
            <div className="fld"><label>Target Forum</label><select value={aiSeedTarget} onChange={e=>{const t=e.target.value;setAiSeedTarget(t);loadAiCache(t)}}><option value="National">🇳🇬 National</option>{ALL_STATES.map(s=><option key={s} value={s}>🏛️ {s}</option>)}</select></div>

            <button className="bp" style={{fontSize:13,width:"100%"}} disabled={aiLoading} onClick={async()=>{setAiLoading(true);setAiState("Searching for today's headlines…");setAiHeadlines([]);const r=await aiFetchHeadlines(aiSeedTarget);setAiLoading(false);if(!r.ok){setAiState("Error: "+r.text);return}const arr=extractJSON(r.text);if(arr&&Array.isArray(arr)&&arr.length>0){setAiHeadlines(arr);setAiState(`Found ${arr.length} headlines for ${aiSeedTarget}`);saveAiCache(aiSeedTarget,arr,aiResults)}else{setAiState("Could not parse headlines. Raw: "+r.text.slice(0,150)+"…");setAiHeadlines([])}}}>
              {aiLoading&&aiHeadlines.length===0?<span className="ai-gen"><span className="ai-spin"/>Fetching Headlines…</span>:"🔍 Fetch Today's Headlines"}</button>

            {aiState&&<div className={`ai-status ${aiLoading?"ai-loading":aiHeadlines.length>0||aiResults.length>0?"ai-ok":"ai-err"}`}>{aiState}</div>}

            {aiHeadlines.length>0&&<><div style={{fontSize:13,fontWeight:700,marginTop:14,marginBottom:8}}>📋 Select a headline to write:</div>
            {aiHeadlines.map((h,i)=><div key={i} style={{background:"var(--bg2)",borderRadius:10,padding:12,marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,lineHeight:1.4}}>{h.title}</div>{h.summary&&<div style={{fontSize:11,color:"var(--txt3)",marginTop:4}}>{h.summary}</div>}{h.source&&h.source!==""&&<div style={{fontSize:10,color:"var(--grn)",marginTop:2,wordBreak:"break-all"}}>{h.source.slice(0,60)}</div>}</div>
              <button className="bp" style={{fontSize:11,padding:"6px 12px",flexShrink:0}} disabled={aiLoading} onClick={async()=>{setAiLoading(true);setAiState(`Writing article: "${h.title.slice(0,40)}…"`);const r=await aiWriteArticle(h,aiSeedTarget);setAiLoading(false);if(!r.ok){setAiState("Error writing article: "+r.text);return}const art=extractJSON(r.text);if(art&&art.title&&art.body){const newResults=[...aiResults,art];const newHeadlines=aiHeadlines.filter((_,j)=>j!==i);setAiResults(newResults);setAiHeadlines(newHeadlines);setAiState("Article ready for review");saveAiCache(aiSeedTarget,newHeadlines,newResults)}else{setAiState("Could not parse article. Raw: "+r.text.slice(0,150)+"…")}}}>
                {aiLoading?<span className="ai-spin"/>:"✍️ Write"}</button>
            </div>)}</>}

            {aiResults.length>0&&<><div style={{fontSize:13,fontWeight:700,marginTop:14,marginBottom:8}}>📝 Ready to publish ({aiResults.length}):</div>
            {aiResults.map((r,i)=><div key={i} style={{background:"var(--bg2)",borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8}}><strong style={{fontSize:14,lineHeight:1.3}}>{r.title}</strong><span className="ai-tag" style={{flexShrink:0}}>AI Seed</span></div>
              <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6,marginBottom:8,maxHeight:120,overflow:"hidden",WebkitMaskImage:"linear-gradient(to bottom, black 70%, transparent 100%)"}}>{r.body}</div>
              {r.source&&r.source!==""&&<div style={{fontSize:11,marginBottom:10}}><span style={{color:"var(--txt3)"}}>Source: </span><a href={r.source} target="_blank" rel="noopener noreferrer" style={{color:"var(--grn)",fontWeight:600,textDecoration:"none",wordBreak:"break-all"}}>{r.source.length>60?r.source.slice(0,60)+"…":r.source}</a></div>}
              <div style={{display:"flex",gap:8,alignItems:"center"}}><button className="bp" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{const isNat=aiSeedTarget==="National";const bot=isNat?MU[0]:getBot(aiSeedTarget);let bodyClean=(r.body||"").replace(/```json\s*/g,"").replace(/```/g,"").replace(/^\s*\{[\s\S]*?\}\s*$/,"").trim();if(!bodyClean.includes("<p>"))bodyClean=bodyClean.split(/\n\n+/).filter(p=>p.trim()).map(p=>"<p>"+p.trim()+"</p>").join("");const sourceHtml=r.source&&r.source!==""?`<p style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:11px;color:#888;">Source: <a href="${r.source}" target="_blank" rel="noopener noreferrer" style="color:#059669;font-weight:600;">${r.source}</a></p>`:"";const fullBody=bodyClean+sourceHtml;const np={id:"p"+Date.now()+i,author:bot,forum:isNat?"national":"state",state:isNat?null:aiSeedTarget,lga:null,category:"News",tag:"News",title:r.title,body:fullBody,poll:null,image:null,likes:0,dislikes:0,replies:0,views:0,time:"just now",ts:Date.now(),isBreaking:false,isHot:false,_edited:false,promotedTo:[]};setPosts(p=>[np,...p]);logAction("AI seed post",`"${r.title}" → ${aiSeedTarget} (as @${bot.username})`);const newResults=aiResults.filter((_,j)=>j!==i);setAiResults(newResults);saveAiCache(aiSeedTarget,aiHeadlines,newResults)}}>Publish to {aiSeedTarget} Forum</button><button className="bg" style={{fontSize:11,padding:"6px 12px"}} onClick={()=>{const newResults=aiResults.filter((_,j)=>j!==i);setAiResults(newResults);saveAiCache(aiSeedTarget,aiHeadlines,newResults)}}>Discard</button></div>
            </div>)}</>}
          </div>

          <div className="ai-box"><h3>🔍 Content Sweep</h3><p style={{fontSize:12,color:"var(--txt3)",marginBottom:12}}>Run all posts through NairaMod bot to find violations (checks up to 20 posts).</p>
            <button className="bp" style={{fontSize:13}} onClick={()=>{const r=contentSweep(posts);setSweepResults(r);const flagged=r.filter(x=>x.reason);logAction("Content sweep",`Checked ${r.length} posts, ${flagged.length} flagged`);flagged.forEach(f=>{if(!reports.find(rp=>rp.postId===f.post.id))setReports(rps=>[...rps,{id:"rp"+Date.now()+Math.random(),postId:f.post.id,postTitle:f.post.title,author:f.post.author.username,reportedBy:"NairaMod Bot",reason:f.reason,detail:`Auto-detected in ${f.source}`,severity:"medium",status:"pending",count:1,time:"just now"}])})}}>Run Sweep</button>
            {sweepResults&&<><div className="ai-status ai-ok">Checked {sweepResults.length} posts — {sweepResults.filter(x=>x.reason).length} flagged</div>{sweepResults.map((r,i)=><div key={i} className="sweep-result"><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.post.title}</span>{r.reason?<span className="sweep-flag">🚩 {r.reason}</span>:<span className="sweep-ok">✓ Clean</span>}</div>)}</>}
          </div>

          <div className="ai-box"><h3>💬 AI Reply Generation</h3><p style={{fontSize:12,color:"var(--txt3)",marginBottom:8}}>On any thread, admins and super admins see the "🤖 AI Reply" button. Clicking it generates a reply as a random bot citizen from that state. The reply is shown in a <strong>preview card</strong> — you review the content and the bot username before choosing to Post, Discard, or Regenerate. Nothing is posted without your approval.</p><div style={{fontSize:12,color:"var(--txt3)"}}>Access: <strong style={{color:"var(--grn)"}}>Super Admin + Admin only</strong> — moderators cannot see this button.</div></div>
        </>}

        {aTab==="activeads"&&<><div className="fh">⏱️ Active Ads ({activeAds.length})</div>{activeAds.length===0&&<div className="empty"><p>No active ads.</p></div>}{activeAds.map(a=>{const rem=a.endDate-Date.now();const sc=a.scopes||[a.scope];return <div key={a.id} className="ad-mgr">
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            {a.imgUrl?<img src={a.imgUrl} style={{width:56,height:36,objectFit:"cover",borderRadius:8,flexShrink:0}} alt="" onError={e=>{e.target.style.display="none"}}/>:<div style={{width:56,height:36,borderRadius:8,background:"var(--bg3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--txt3)",flexShrink:0}}>No img</div>}
            <div style={{flex:1,minWidth:0}}><div className="ad-mgr-title">{a.title}</div>{a.linkUrl&&a.linkUrl!=="#"&&<div style={{fontSize:11,color:"var(--txt3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.linkUrl}</div>}</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>{sc.slice(0,6).map((s,i)=><span key={i} style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--bg2)",color:"var(--txt3)"}}>{s==="national"?"🇳🇬 National":s.replace("state_","🏛️ ").replace("lga_","🏘️ ")}</span>)}{sc.length>6&&<span style={{fontSize:10,color:"var(--txt3)"}}>+{sc.length-6} more</span>}</div>
          <div className="ad-mgr-cd">⏱ {fmtCd(rem)} remaining</div>
          <div className="ad-mgr-actions"><button className="bg" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>{setAds(ax=>ax.map(x=>x.id===a.id?{...x,status:"paused"}:x));logAction("Paused ad",a.title)}}>Pause</button><button style={{fontSize:11,padding:"4px 10px",borderRadius:8,fontWeight:600,color:"var(--red)"}} onClick={()=>{setAds(ax=>ax.filter(x=>x.id!==a.id));logAction("Deleted ad",a.title)}}>Delete</button></div></div>})}</>}

        {aTab==="announce"&&<><div className="fh">📣 Site Announcement</div><div className="fld"><label>Announcement Message</label><textarea value={announceText} onChange={e=>setAnnounceText(e.target.value)} placeholder="Write site-wide announcement…" style={{width:"100%",minHeight:100,padding:12,borderRadius:12,border:"1px solid var(--bdr)",background:"var(--bg2)",color:"var(--txt)",fontSize:14,outline:"none",resize:"vertical"}}/></div><button className="bp" onClick={()=>{if(!announceText.trim())return;setNotifs(n=>[{id:"n"+Date.now(),type:"announcement",title:"📣 Site Announcement",body:announceText,linkView:null,linkExtra:{},isRead:false,time:"just now"},...n]);logAction("Announcement",announceText.slice(0,60));setAnnounceText("")}}>Send to All Users</button></>}

        {aTab==="log"&&<><div className="fh">📋 Activity Log ({actLog.length})</div>{actLog.map(l=><div key={l.id} className="log-row"><span className="log-actor">{l.actor}</span><span className="log-action">{l.action} — {l.detail}</span><span className="log-time">{l.time}</span></div>)}</>}

        {aTab==="settings"&&<><div className="fh">⚙️ Site Settings</div><div style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:14,overflow:"hidden"}}>{[["Registration","Open to public"],["NairaMod Bot","Auto-moderation active"],["AI Features","Disabled (no API key)"]].map(([k,v],i)=><div key={i} style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:i<2?"1px solid var(--bdr)":"none"}}><div><div style={{fontSize:14,fontWeight:600}}>{k}</div><div style={{fontSize:12,color:"var(--txt3)"}}>{v}</div></div><div style={{width:44,height:24,borderRadius:12,background:"var(--grn)",position:"relative",cursor:"pointer"}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:2,left:22,boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/></div></div>)}</div></>}

        {aTab==="forums"&&<><div className="fh">🏛️ Forum Controls</div>{ALL_STATES.slice(0,6).map(s=><div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--bdr)"}}><div><div style={{fontSize:14,fontWeight:600}}>{s} State Forum</div><div style={{fontSize:11,color:suspended["state_"+s]?"var(--red)":"var(--grn)",fontWeight:600}}>{suspended["state_"+s]?"Suspended":"Active"}</div></div><button className={suspended["state_"+s]?"bp":"bg"} style={{fontSize:11,padding:"4px 12px"}} onClick={()=>{setSuspended(s2=>({...s2,["state_"+s]:!s2["state_"+s]}));logAction(suspended["state_"+s]?"Unsuspended":"Suspended",s+" State Forum")}}>{suspended["state_"+s]?"Unsuspend":"Suspend"}</button></div>)}</>}

        {aTab==="bots"&&<><div className="fh">👥 Bot Users — {ALL_BOTS.length} total across {ALL_STATES.length} states</div>
          <p style={{fontSize:12,color:"var(--txt3)",marginBottom:14,lineHeight:1.5}}>Bot users post and reply as regular members. AI seeding and AI replies use random bots from the target state. Disable a state's bots when real users are active.</p>

          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <button className="bp" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{setBotStates(s=>{const n={};ALL_STATES.forEach(st=>n[st]=true);return n});logAction("Enabled all bots","All states")}}>Enable All</button>
            <button className="bg" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>{setBotStates(s=>{const n={};ALL_STATES.forEach(st=>n[st]=false);return n});logAction("Disabled all bots","All states")}}>Disable All</button>
            <span style={{fontSize:12,color:"var(--grn)",fontWeight:600,display:"flex",alignItems:"center"}}>{ALL_STATES.filter(s=>botStates[s]).length} / {ALL_STATES.length} states active</span>
          </div>

          <div className="fld" style={{marginBottom:12}}><input value={botFilter} onChange={e=>setBotFilter(e.target.value)} placeholder="Filter states…"/></div>

          {ALL_STATES.filter(s=>!botFilter||s.toLowerCase().includes(botFilter.toLowerCase())).map(s=>{const bots=BOT_USERS[s]||[];const isActive=botStates[s];return <div key={s} style={{background:"var(--bg1)",border:"1px solid var(--bdr)",borderRadius:12,padding:14,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isActive?8:0}}>
              <div><div style={{fontSize:14,fontWeight:700}}>{s} State</div><div style={{fontSize:11,color:"var(--txt3)"}}>{bots.length} bot users</div></div>
              <button className={isActive?"bg":"bp"} style={{fontSize:11,padding:"4px 12px"}} onClick={()=>{setBotStates(bs=>({...bs,[s]:!bs[s]}));logAction(isActive?"Disabled bots":"Enabled bots",s+" State")}}>{isActive?"Disable":"Enable"}</button>
            </div>
            {isActive&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{bots.slice(0,10).map(b=><span key={b.id} style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"var(--bg2)",color:"var(--txt2)"}}>{b.username}</span>)}{bots.length>10&&<span style={{fontSize:11,padding:"2px 8px",color:"var(--txt3)"}}>+{bots.length-10} more</span>}</div>}
          </div>})}
        </>}
      </div>

      {/* Admin bottom tab bar */}
      <nav className="adm-bnav">{mainTabs.map(([k,ic,lb])=><button key={k} className={`adm-tab${aTab===k?" on":""}`} onClick={()=>{setATab(k);setMoreOpen(false)}}><span className="ati">{ic}</span>{lb}</button>)}<button className={`adm-tab${moreTabs.some(([k])=>k===aTab)?" on":""}`} onClick={()=>setMoreOpen(s=>!s)}><span className="ati">⋯</span>More</button></nav>

      {/* More sheet */}
      {moreOpen&&<><div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",zIndex:550}} onClick={()=>setMoreOpen(false)}/><div className="more-sheet">{moreTabs.map(([k,ic,lb])=><div key={k} className="more-sheet-item" onClick={()=>{setATab(k);setMoreOpen(false)}}><span style={{fontSize:20}}>{ic}</span>{lb}</div>)}</div></>}

      {/* Strike modal */}
      {strikeModal&&<div className="mbg" onClick={e=>e.target===e.currentTarget&&setStrikeModal(null)}><div className="strike-modal"><div style={{fontSize:18,fontWeight:800,marginBottom:14}}>Issue Strike</div><div style={{fontSize:14,marginBottom:8}}>User: <strong>@{strikeModal}</strong></div>{(()=>{const u=MU.find(x=>x.username===strikeModal);return u?<><div className="strike-bar">{[1,2,3].map(i=><div key={i} className={`strike-pip${i<=u.strikes+1?" filled":""}`}/>)}</div><div style={{fontSize:12,color:"var(--txt3)",marginBottom:12}}>This will be strike {u.strikes+1} of 3.{u.strikes+1>=3?" Account will be auto-suspended.":""}</div></>:null})()}<div className="fld"><label>Reason</label><select value={strikeReason} onChange={e=>setStrikeReason(e.target.value)}>{["Ethnic hate speech","Misinformation","Spam","Harassment","Doxxing","Scam","Violence","Custom"].map(r=><option key={r}>{r}</option>)}</select></div><div style={{display:"flex",gap:8}}><button className="bg" style={{flex:1}} onClick={()=>setStrikeModal(null)}>Cancel</button><button style={{flex:1,padding:"10px",borderRadius:10,fontSize:13,fontWeight:600,background:"var(--red)",color:"#fff"}} onClick={()=>{const u=MU.find(x=>x.username===strikeModal);if(u)issueStrike(u.id,strikeReason);setStrikeModal(null)}}>Issue Strike</button></div></div></div>}
    </div>};

  const Placeholder=({title,icon})=><div className="fw"><div className="empty" style={{paddingTop:80}}><div className="empty-ic">{icon}</div><p style={{fontSize:16,fontWeight:600,marginBottom:6}}>{title}</p><p style={{fontSize:13,color:"var(--txt3)"}}>Coming soon</p></div></div>;

  return <><style>{CSS}</style><div className="app"><Header/>
    {view==="home"&&<Home/>}
    {view==="state"&&(isIn?<Forum type="state"/>:<Placeholder title="Sign in to access State forums" icon="🏛"/>)}
    {view==="lga"&&(isIn?<Forum type="lga"/>:<Placeholder title="Sign in to access LGA forums" icon="🏘"/>)}
    {view==="nat"&&<Forum type="national"/>}{view==="thread"&&<Thread/>}
    {view==="inbox"&&(isIn?<Inbox/>:<Placeholder title="Sign in to view Inbox" icon="✉️"/>)}
    {view==="profile"&&(isIn?<Profile/>:<Placeholder title="Sign in" icon="👤"/>)}
    {view==="search"&&<Search/>}
    {view==="guidelines"&&<GuidelinesFullPage/>}
    {view==="civicedu"&&<CivicEduFullPage go={go}/>}
    {view==="edu"&&<EduDetailPage slide={vx.slide} go={go} backView={vx.backView}/>}
    {view==="leaders"&&<LeadersPage go={go} user={user}/>}
    {view==="leaderprofile"&&<LeaderProfilePage leader={vx.leader} go={go}/>}
    {view==="admin"&&isIn&&(user.role==="admin"||user.role==="super_admin")&&<Admin/>}
    {view!=="admin"&&<BNav/>}{isIn&&view!=="thread"&&view!=="admin"&&canPost(cForum,cState,cLga)&&<button className="fab" onClick={()=>setModal("post")}>+</button>}
  </div>
  {modal==="signin"&&<SignIn onClose={()=>setModal(null)} onSwitch={()=>setModal("register")} onLogin={onLogin}/>}
  {modal==="register"&&<Register onClose={()=>setModal(null)} onSwitch={()=>setModal("signin")} onReg={onReg}/>}
  {modal==="post"&&<NewPost onClose={()=>setModal(null)} onSubmit={addPost} forum={cForum} state={cState} lga={cLga} defaultCat={aCat}/>}
  {deleteConfirm&&<div className="mbg" onClick={e=>e.target===e.currentTarget&&setDeleteConfirm(null)}><div className="del-confirm">
    <h3>Delete {deleteConfirm.type==="post"?"Post":"Reply"}?</h3>
    <p>"{(deleteConfirm.title||"").slice(0,60)}{(deleteConfirm.title||"").length>60?"…":""}"<br/><br/>This action cannot be undone.</p>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}><button className="bg" style={{flex:1,padding:"10px"}} onClick={()=>setDeleteConfirm(null)}>Cancel</button><button style={{flex:1,padding:"10px",borderRadius:10,fontSize:13,fontWeight:600,background:"var(--red)",color:"#fff"}} onClick={()=>{if(deleteConfirm.type==="post")deletePost(deleteConfirm.id);else deleteReply(deleteConfirm.postId,deleteConfirm.id)}}>Delete</button></div>
  </div></div>}
  </>;
}
