<script>

  function getProductsCookie(){
    var cookie = document.cookie,
        _return = [],
        _data = [],
        flag = true;

    if (document.cookie.indexOf('product=') != -1) {
      cookie = cookie.substr(document.cookie.indexOf('product='), cookie.length);
      cookie = cookie.split("=")[1].split(",");
      for(var i = 0; i < cookie.length; i++){
        if(parseInt(cookie[i])){
          _data.push(cookie[i]);
        }
      }
    }

    for(var i = 0; i < _data.length; i++){
      flag = true;
      for(var j = 0; j < _return.length; j++){
        if(_return[j] == _data[i].split(";")[0]){
          flag = false;
        }
      }
      if(flag){
        _return.push(_data[i].split(";")[0])
      }
    }
    return _return;
  };

  function removeProductsCookie(product){
    var cookie = getProductsCookie();
    document.cookie = "product=";
    document.getElementById('star' + product).setAttribute("class", "product-box__favorite__star");
    for(var i = 0; i < cookie.length; i++){
      if(parseInt(cookie[i]) != parseInt(product)){
        setProductsCookie(cookie[i]);
      }
    }
    refresh();
  };

  function setProductsCookie(valor){
    var cookie = getProductsCookie(),
        _return = "";
    for(var i = 0; i < cookie.length; i++){
      _return = _return + ',' + cookie[i];
    }
    document.cookie = "product=" + _return + ',' + valor;
    refresh();
  };

	function refresh(){
    var cookie = getProductsCookie();
    for(var i = 0; i < cookie.length; i++){
      if(document.getElementById('star' + cookie[i])){
        document.getElementById('star' + cookie[i]).setAttribute("class", "product-box__favorite__star product-box__favorite__star-active");
      }
    }
	};

  function star(product){
    var cookie = getProductsCookie(),
        flag = true;

    for(var i = 0; i < cookie.length; i++){
      if(cookie[i] == product){
        flag = false;
      }
    };

    if(flag){
      setProductsCookie(product);
    }else{
      removeProductsCookie(product);
    }
  };

  refresh();

</script>