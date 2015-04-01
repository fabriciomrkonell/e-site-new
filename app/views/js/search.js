<script>
	function pesquisar(event, departamento){
	  if(event.keyCode == 13 || event.type == "click"){
	    if(departamento){
	      window.location = "/ofertas?dep=" + departamento + "&exp=" + document.getElementById("search").value;
	    }else{
	      window.location = "/ofertas?exp=" + document.getElementById("search").value;
	    }
	  }
	};
</script>