<script src="lib/jquery/dist/jquery.min.js"></script>
<script src="build/js/main.js"></script>
<script>
$('.banner-site__content').after('<div id="banner-site__nav" class="banner-site__nav">')
.cycle({
  fx: 'fade',
  speed: 'fast',
  pager: '#banner-site__nav'
});
</script>