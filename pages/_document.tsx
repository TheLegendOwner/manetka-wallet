import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru" className="scrollbar-none">
      <Head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/favicon.svg"
          as="image"
          type="image/svg+xml"
        />
        
        {/* DNS prefetch для критических доменов */}
        <link rel="dns-prefetch" href="//api.getgems.io" />
        <link rel="dns-prefetch" href="//tonapi.io" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Inline critical CSS for loading state */}
        <style jsx>{`
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 2px solid #f59e0b;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </Head>
      
      <body className="antialiased">
        {/* Fallback для отключенного JavaScript */}
        <noscript>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#fefefe',
            color: '#1a1a1a'
          }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              JavaScript Required
            </h1>
            <p style={{ marginBottom: '1rem' }}>
              MANETKA WALLET requires JavaScript to function properly.
            </p>
            <p>
              Please enable JavaScript in your browser settings and reload the page.
            </p>
          </div>
        </noscript>
        
        <Main />
        <NextScript />
        
        {/* Analytics and monitoring scripts would go here in production */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Production analytics initialization
                console.log('MANETKA WALLET Production Mode');
              `,
            }}
          />
        )}
      </body>
    </Html>
  );
}