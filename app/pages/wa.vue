<script setup lang="ts">
useHead({
  title: 'Redirecting to WhatsApp...',
  script: [
    {
      innerHTML: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1350902166329677'); 
        fbq('track', 'Contact');
      `,
      type: 'text/javascript',
    },
  ],
})

// Redirect after a short delay (can be adjusted)
onMounted(() => {
  setTimeout(() => {
    window.location.href = 'https://wa.me/4969348753210'
  }, 1000)
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="text-lg">Redirecting you to WhatsApp...</p>
  </div>
</template>
