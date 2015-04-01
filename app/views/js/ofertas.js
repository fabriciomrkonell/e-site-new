<script>
  function proxima(pagina, departamento, expressao){
    if(departamento){
      if(expressao != null || expressao != ''){
        window.location = "/ofertas?dep=" + departamento + "&pag=" + (parseInt(pagina) + 1) + "&exp=" + document.getElementById("search").value;
      }else{
        window.location = "/ofertas?dep=" + departamento + "&pag=" + (parseInt(pagina) + 1);
      }
    }else{
      if(expressao != null || expressao != ''){
        window.location = "/ofertas?pag=" + (parseInt(pagina) + 1) + "&exp=" + document.getElementById("search").value;
      }else{
        window.location = "/ofertas?pag=" + (parseInt(pagina) + 1);
      }
    }
  };

  function anterior(pagina, departamento, expressao){
    if(departamento){
      if(expressao != null || expressao != ''){
        window.location = "/ofertas?dep=" + departamento + "&pag=" + (parseInt(pagina) - 1) + "&exp=" + document.getElementById("search").value;
      }else{
        window.location = "/ofertas?dep=" + departamento + "&pag=" + (parseInt(pagina) - 1);
      }
    }else{
      if(expressao != null || expressao != ''){
        window.location = "/ofertas?pag=" + (parseInt(pagina) - 1) + "&exp=" + document.getElementById("search").value;
      }else{
        window.location = "/ofertas?pag=" + (parseInt(pagina) - 1);
      }
    }
  };
</script>