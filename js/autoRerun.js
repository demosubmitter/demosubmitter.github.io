var timer=null;

function update_lsm_tree(id, lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E, obsolete_coefficient){
  if(id == 'lsm_tree_L' || id == 'UI-ratio'){
    var result = getLSMTreeT(lsm_tree_type);
    var T = result[0];
    var maxL = result[1];
      if(T < 2){
        alert("L="+lsm_tree_L+" is larger than the maximum L="+maxL+" in LSM-tree.")
        console.log("L="+lsm_tree_L+" is larger than the maximum L="+maxL+" in LSM-tree.");
        update_lsm_tree('lsm_tree_T', lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E)

    }

    document.getElementById("lsm_tree_T").value=T;


  }else if(id.startsWith('lsm_tree') || id == 'N' || id == "E" || id == "Key-Size" || id == "P" || id == "UI-ratio"){
    var L;
    if(lsm_tree_type == 0){
      L = Math.log(N*Math.floor(lsm_tree_T-1)*E/lsm_tree_mbuffer)/Math.log(lsm_tree_T);
    }else{
      L = Math.log(N*E/lsm_tree_mbuffer)/Math.log(lsm_tree_T);
    }

    if(Math.abs(L - Math.round(L))<1e-6){
      L = Math.round(L);
    }else{
      L = Math.ceil(L);
    }
    var tmpN;
    if(lsm_tree_type == 0){
      tmpN = obsolete_coefficient*((1 - 1/Math.pow(lsm_tree_T, L))/(1 - 1/lsm_tree_T)*N*(Math.floor(lsm_tree_T)-1) + lsm_tree_mbuffer/E - N)+N;
    }else{
      tmpN = obsolete_coefficient*((1 - 1/Math.pow(lsm_tree_T, L))/(1 - 1/lsm_tree_T)*N + lsm_tree_mbuffer/E - N) + N;
    }
    L = Math.log(tmpN*E*(lsm_tree_T-1)/lsm_tree_mbuffer+1)/Math.log(lsm_tree_T)-1;
    if(Math.abs(L - Math.round(L))<1e-6){
      L = Math.round(L);
    }else{
      L = Math.ceil(L);
    }

    if(L < 0){
      L = 0;
    }
    document.getElementById("lsm_tree_L").value=L;
  }

  	draw_lsm_graph("lsm_tree");
}

function re_run(e) {
    if(timer){
        clearTimeout(timer);
        timer = null;
    }

    var event = e || event;
    // console.log(event)

    var x = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
    // console.log(event.timeStamp)
    // console.log(x)

    if (!((x==38 || x==40) && (event.target.id=="E" || event.target.id=="mbuffer" || event.target.id=="P" || event.target.id=="T")))
    {
	    if (x>=37 && x<=40 || x==9 || x==16 || x==17 || x==91 || x==18 || x==65)
	    {
	        // if (event.target.id=="N" || event.target.id=="mfilter")
	        console.log("User is clicking ["+x+"] on arrows or tab (9) or shift (16) or ctrl (17) or cmd (91) or alt (18). No rerun.")
	        return;
	    }
	}

    if(event.target.id.endsWith("mfilter_per_entry"))
    {
        var mfilter_per_entry = parseFloat(document.getElementById(event.target.id).value);
        if(!isNaN(mfilter_per_entry)){
        document.getElementById(event.target.id).value=mfilter_per_entry
      }else{
        document.getElementById(event.target.id).value="";
      }
        // console.log(numberWithCommas(N))
    }

    var N = parseInt(document.getElementById("N").value.replace(/\D/g,''),10);
    var P = parseInt(document.getElementById("P").value.replace(/\D/g,''),10);
    document.getElementById("N").value=numberWithCommas(N)
    var E = parseInt(document.getElementById("E").value.replace(/\D/g,''),10);
    var w=parseFloat(document.getElementById("w").value);
    var r=parseFloat(document.getElementById("r").value);
    var v=parseFloat(document.getElementById("v").value);
    var qL=parseFloat(document.getElementById("qL").value);

    var obsolete_coefficient_str = document.getElementById("obsolete_coefficient").value;
    if(isNaN(obsolete_coefficient_str)){
      alert(obsolete_coefficient_str+" is not valid.")
      console.log("UI ratio is not valid: "+obsolete_coefficient_str)
      document.getElementById("UI-ratio").value=1.0;
    }
    var obsolete_coefficient = parseFloat(obsolete_coefficient_str);
    if(obsolete_coefficient > 1 || obsolete_coefficient < 0){
      alert(obsolete_coefficient+" should be in the range of [0, 1].")
      console.log("Obsolete coefficient should be in the range of (0, 1) :"+key_size)
      document.getElementById("obsolete_coefficient").value=1.0;
    }

    if(r <= 0.0){
      document.getElementById("Zero-result-lookup-text-Div").style.display='none';
    }else{
      document.getElementById("Zero-result-lookup-text-Div").style.display='';
    }

    document.getElementById("data_size_text").innerText=formatBytes(N*E,1);
    document.getElementById("E_text").innerText = E;
    document.getElementById("P_text").innerText = formatBytes(P,1);
    document.getElementById("read_latency_text").innerText = document.getElementById("read-latency").value;
    document.getElementById("write_latency_text").innerText = document.getElementById("write-latency").value;

    if(event.target.id == "Key-Size"){
      var key_size = document.getElementById("Key-Size").value;
      if(isNaN(key_size)){
        alert("Key_Size="+key_size+" is not a valid number.")
        console.log("Key Size is not a valid number: "+key_size)
        document.getElementById("Key-Size").value=E/2;
      }else if(key_size <= 0 || key_size >= E){
        alert("Key_Size="+key_size+" should be in the range of (0, " + E + ").")
        console.log("Key Size should be in the range of (0, " + E + ") :"+key_size)
        document.getElementById("Key-Size").value=E/2;
      }else{
        document.getElementById("lsm_bush_mfence_pointer_per_entry").value=key_size/(P/E)*8;
        document.getElementById("lsm_tree_mfence_pointer_per_entry").value=key_size/(P/E)*8;
      }
      document.getElementById("key_size_text").value=key_size;
    }

    //lsh-Table
    var lsh_table_mbuffer = document.getElementById("lsh_table_mbuffer").value;
    if(isNaN(lsh_table_mbuffer)){
      alert("LSH-Table buffer="+lsh_table_mbuffer+" MB is invalid.")
      console.log("LSH-Table buffer is invalid: "+lsh_table_mbuffer);
      document.getElementById("lsh_table_mbuffer") = 2;
      lsh_table_mbuffer = 2;
    }
    lsh_table_mbuffer = parseFloat(lsh_table_mbuffer);
    if (lsh_table_mbuffer<0){
        alert("Buffer="+lsh_table_mbuffer+" is too small in LSH-Table.");
        document.getElementById("lsh_table_mbuffer") = 2;
        lsh_table_mbuffer = 2;
    }
    lsh_table_mbuffer *= 1048576;
    var hash_table_gc_threshold =document.getElementById("lsh_table_gc_threshold").value;
    if(isNaN(hash_table_gc_threshold)){

      alert("GC Threshold="+hash_table_gc_threshol+" is invalid.");
      console.log("The threshold ratio of garbage collection is invalid: "+hash_table_gc_threshold);
      document.getElementById("lsh_table_gc_threshold").value = 0.5;
      hash_table_gc_threshold = 0.5;
    }
    hash_table_gc_threshold = parseFloat(hash_table_gc_threshold);
    if (hash_table_gc_threshold<=0 || hash_table_gc_threshold >= 1){
        alert("GC Threshold="+hash_table_gc_threshold+" should be in the range (0, 1).");
        document.getElementById("lsh_table_gc_threshold").value = 0.5;
        hash_table_gc_threshold = 0.5;
    }
    scenario1();

    // lsm tree
    var L = document.getElementById("lsm_tree_L").value;
    if(isNaN(L)){
      alert("LSM-Tree Level="+L+" is invalid.")
      console.log("LSM-Tree level is invalid: "+L);
      var tmpN;
      if(lsm_tree_type == 0){
        tmpN = obsolete_coefficient*((1 - 1/lsm_tree_T)/(1 - 1/(Math.pow(lsm_tree_T, L)))*N*(Math.floor(lsm_tree_T)-1) - N)+N;
      }else{
        tmpN = obsolete_coefficient*((1 - 1/lsm_tree_T)/(1 - 1/(Math.pow(lsm_tree_T, L)))*N - N) + N;
      }
      L = Math.ceil(Math.log(tmpN*E*(lsm_tree_T-1)/lsm_tree_mbuffer+1/lsm_tree_T)/Math.log(lsm_tree_T))
      document.getElementById("lsm_tree_L").value = L;
      lsm_tree_L = L;
    }
    lsm_tree_L = parseInt(L);
    if(lsm_tree_L < 0){
      alert("Level="+lsm_tree_L+" is too small in LSM-Tree.");
      document.getElementById("lsm_tree_L").value = 6;
      lsm_tree_L = 6;
    }
    var lsm_tree_mbuffer = document.getElementById("lsm_tree_mbuffer").value;
    if(isNaN(lsm_tree_mbuffer)){
      alert("LSM-Tree buffer="+lsm_tree_mbuffer+" MB is invalid.")
      console.log("LSM-Tree buffer is invalid: "+lsm_tree_mbuffer);
      document.getElementById("lsm_tree_mbuffer").value = 2;
      lsm_tree_mbuffer = 2;
    }
    lsm_tree_mbuffer = parseFloat(lsm_tree_mbuffer);
    if (lsm_tree_mbuffer<0){

        alert("Buffer="+lsm_tree_mbuffer+" is too small in LSM-Tree.");
        document.getElementById("lsm_tree_mbuffer").value = 2;
        lsm_tree_mbuffer = 2;
    }
    lsm_tree_mbuffer *= 1048576;
    var lsm_tree_T = document.getElementById("lsm_tree_T").value;
    if(isNaN(lsm_tree_T)){
      alert("LSM-Tree T="+lsm_tree_T+" is invalid.")
      console.log("LSM-Tree size ratio is invalid: "+lsm_tree_T);
      lsm_tree_T = getLSMTreeT(lsm_tree_type);
      document.getElementById("lsm_tree_T").value = lsm_tree_T;
    }
    lsm_tree_T = parseFloat(lsm_tree_T);
    if (lsm_tree_T<2){

        alert("Size Ratio="+lsm_tree_T+" is too small in LSM-Tree.");
        document.getElementById("lsm_tree_T").value = 2;
        lsm_tree_T = 2;
    }else if(lsm_tree_T > P/E){
      alert("Size Ratio="+lsm_tree_T+" is too large in LSM-Tree.");
      document.getElementById("lsm_tree_T").value = P/E;
      lsm_tree_T = P/E;
    }
    var lsm_tree_type=getBoldButtonByName("lsm_tree_type");
    update_lsm_tree(event.target.id, lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E, obsolete_coefficient);

    //B_epsilon tree
    var fanout = document.getElementById("B_epsilon_tree_fanout").value;
    if(isNaN(fanout)){
      alert("Facnout ="+fanout+" is invalid.")
      console.log("Fanout is invalid: "+fanout);
      var H = parseInt(document.getElementById("B_epsilon_tree_height").value);
      if(H > 1){
        fanout = Math.floor(Math.pow((N+1)/2, 1/(H-1))*2);
      }else{
        fanout = Math.ceil(N/(P/E));
      }
      document.getElementById("B_epsilon_tree_fanout").value = fanout;
    }
    if (fanout<2){

        alert("Fanout="+fanout+" is too small in B Tree.");
        document.getElementById("B_epsilon_tree_fanout").value = 2;
        fanout = 2;
    }
    var t = 2;
  	if(fanout != 2){
  		t = Math.ceil(fanout/2)
  	}
    var H = Math.log((N+1)/2)/Math.log(t)+1;
    document.getElementById("B_epsilon_tree_height").value = H;

    scenario3();



    // design continuum
    var design_continuum_T = parseFloat(document.getElementById("design_continuum_T").value);
    var design_continuum_mbuffer = document.getElementById("design_continuum_mbuffer").value;
    if(isNaN(design_continuum_mbuffer)){
      alert("Design Continuum's buffer="+design_continuum_mbuffer+" MB is invalid.")
      console.log("Design Continuum's buffer is invalid: "+design_continuum_mbuffer);
      document.getElementById("design_continuum_mbuffer").value = 2;
      design_continuum_mbuffer = 2;
    }
    design_continuum_mbuffer = parseFloat(design_continuum_mbuffer);
    if (design_continuum_mbuffer<0){
        alert("Buffer="+design_continuum_mbuffer+" is too small in design continuum.");
        document.getElementById("design_continuum_mbuffer").value = 2;
        design_continuum_mbuffer = 2;
    }
    design_continuum_mbuffer *= 1048576;

    var max_partitions = Math.floor(design_continuum_T) - 1;
    var design_continuum_K=document.getElementById("design_continuum_K").value;
    if(isNaN(design_continuum_K)){
      alert("Design Continuum's K="+design_continuum_K+" is invalid.")
      console.log("Design Continuum's K is invalid: "+design_continuum_K);
      document.getElementById("design_continuum_K").value = 2;
      design_continuum_K = 2;
    }else if(design_continuum_K < 1 || design_continuum_K > max_partitions){
      alert("Design Continuum's K="+design_continuum_K+" should locate in ["+ 1+ "," + max_partitions+"].")
      console.log("Design Continuum's K is invalid: "+design_continuum_K);
      document.getElementById("design_continuum_K").value = 2;
      design_continuum_K = 2;
    }

    var design_continuum_Z=document.getElementById("design_continuum_Z").value;
    if(isNaN(design_continuum_Z)){
      alert("Design Continuum's Z="+design_continuum_Z+" is invalid.")
      console.log("Design Continuum's Z is invalid: "+design_continuum_Z);
      document.getElementById("design_continuum_Z").value = 1;
      design_continuum_Z = 1;
    }else if(design_continuum_Z < 1 || design_continuum_Z > max_partitions){
      alert("Design Continuum's Z="+design_continuum_Z+" should locate in ["+ 1+ "," + max_partitions+"].")
      console.log("Design Continuum's Z is invalid: "+design_continuum_Z);
      document.getElementById("design_continuum_Z").value = 1;
      design_continuum_Z = 1;
    }

    var design_continuum_L = document.getElementById("design_continuum_L").value;
    if(isNaN(design_continuum_L)){
      alert("Design Continuum's Level="+design_continuum_L+" is invalid.")
      console.log("Design Continuum's Level is invalid: "+design_continuum_L);
      document.getElementById("design_continuum_L").value = 6;
      design_continuum_L = 6;
    }



    var design_continuum_T = document.getElementById("design_continuum_T").value;
    if(isNaN(design_continuum_T)){
      alert("Design Continuum's T="+design_continuum_T+" is invalid.")
      console.log("Design Continuum's grow factor is invalid: "+design_continuum_T);
      design_continuum_T = getLSMTreeT(3, "design_continuum")[0];
      document.getElementById("design_continuum_T").value = design_continuum_T;
    }
    design_continuum_T = parseFloat(design_continuum_T);
    if (design_continuum_T<2){

        alert("Grow factor="+design_continuum_T+" is too small in design continuum.");
        document.getElementById("design_continuum_T").value = 2;
        design_continuum_T = 2;
    }

    var max_max_node_size = N/(P/E);
    var design_continuum_D = document.getElementById("design_continuum_D").value;
    if(isNaN(design_continuum_D)){
      alert("Design Continuum's D="+design_continuum_D+" is invalid.")
      console.log("Design Continuum's Max Node Size is invalid: "+design_continuum_D);
      design_continuum_D = 1;
      document.getElementById("design_continuum_D").value = design_continuum_D;
    }
    if (design_continuum_D<1 || design_continuum_D > max_max_node_size){

        alert("Max Node Size D="+design_continuum_D+" should locate in ["+ 1+ "," + max_max_node_size+"].")
        document.getElementById("design_continuum_D").value = 1;
        design_continuum_D = 1;
    }

    if(event.target.id == "design_continuum_L"){
      var design_continuum_T = getLSMTreeT(3, "design_continuum")[0];
      if(design_continuum_T <= 2){
        document.getElementById("design_continuum_T").value = 2;
      }else{
        document.getElementById("design_continuum_T").value = design_continuum_T;
      }

    }
    draw_lsm_graph("design_continuum");

    re_run_now();

}


function re_run_now() {

    var inputParameters = parseInputTextBoxes();

    var N=inputParameters.N;
    var E=inputParameters.E;
    var P=inputParameters.P;

    var read_latency=inputParameters.read_latency;
    var write_latency=inputParameters.write_latency;
    var s=inputParameters.s;
    var w=inputParameters.w;
    var r=inputParameters.r;
    var v=inputParameters.v;
    var qL=inputParameters.qL;

    if (!isNaN(N))
        document.getElementById("N").value=numberWithCommas(N);
    if (!isNaN(E))
        document.getElementById("E").value=E;
    if (!isNaN(P))
        document.getElementById("P").value=P;
    if (!isNaN(read_latency))
        document.getElementById("read-latency").value=read_latency;
    if (!isNaN(write_latency))
        document.getElementById("write-latency").value=write_latency;
    if (!isNaN(s)){
      document.getElementById("s").value=s;
    }else{
      document.getElementById("s").value=8192;
    }

    if (!isNaN(w)){
      document.getElementById("w").value=w;
    }else{
      document.getElementById("w").value=1;
      w = 1;
    }

    if (!isNaN(r)){
      document.getElementById("r").value=r;
    }else{
      document.getElementById("r").value=1;
      r = 1;
    }

    if (!isNaN(v)){
      document.getElementById("v").value=v;
    }else{
      document.getElementById("v").value=1;
      v = 1;
    }

    if (!isNaN(qL)){
      document.getElementById("qL").value=qL;
    }else{
      document.getElementById("qL").value=1;
      qL = 1;
    }

    var sum = qL+r+v+w;
    document.getElementById("write-prop-text").textContent =(w/sum*100).toFixed(4);
    document.getElementById("point-lookup-prop-text").textContent=((v+r)/sum*100).toFixed(4);
    document.getElementById("range-lookup-prop-text").textContent=(qL/sum*100).toFixed(4);
    document.getElementById("range-lookup-target-size-text").textContent = s;



    if(N >= Number.MAX_SAFE_INTEGER){
      alert("Too large N can't be supported!");
      document.getElementById("N").value=68719476736;
      return;
    }


    //clickbloomTuningButton(false)

}
