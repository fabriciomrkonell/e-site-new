<script src="lib/jquery/dist/jquery.min.js"></script>
<script>
	function enviarMensagem(){
	  var obj = {
	    name: document.getElementById('name').value,
	    email: document.getElementById('email').value,
	    phone: document.getElementById('phone').value,
	    subject: document.getElementById('subject').value,
	    message: document.getElementById('message').value
	  };

	  $.ajax({
	    type: "POST",
	    url: "/api/contact",
	    data: obj
	  }).done(function(response) {
	    alert(response.message);
	    if(response.success == 1){
	      clearContato();
	    }
	  });
	};

	function clearContato() {
	  document.getElementById('name').value = "";
	  document.getElementById('email').value = "";
	  document.getElementById('phone').value = "";
	  document.getElementById('subject').value = "";
	  document.getElementById('message').value = "";
	};

	clearContato();
</script>