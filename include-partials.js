// Simple HTML partial loader for Promptify
// Loads all <div data-include="..."></div> with the referenced file's HTML
(function(){
  function loadPartials() {
    var includes = document.querySelectorAll('[data-include]');
    var promises = [];
    
    includes.forEach(function(el) {
      var file = el.getAttribute('data-include');
      if (!file) return;
      
      var promise = fetch(file)
        .then(function(resp) { return resp.text(); })
        .then(function(html) { 
          el.outerHTML = html;
        });
      
      promises.push(promise);
    });
    
    // Wait for all partials to load, then trigger event
    Promise.all(promises).then(function() {
      document.dispatchEvent(new CustomEvent('partialsLoaded'));
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPartials);
  } else {
    loadPartials();
  }
})();
