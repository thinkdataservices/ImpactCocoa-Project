import App from '@/App';
import r2wc from '@r2wc/react-to-web-component';

const registerWishlistDock = (cssLinkArray: string[]) => {
  if (!customElements.get('wishlist-dock')) {
    console.log('registering wishlist-dock web component');

    const StyledApp = () => {
      return (
        <>
          {cssLinkArray.map((cssLink) => (
            <link rel="stylesheet" href={cssLink} key={cssLink} />
          ))}
          <App />
        </>
      );
    };

    const WishlistDock = r2wc(StyledApp, {
      props: { theme: 'string' },
      shadow: 'closed',
    });

    customElements.define('wishlist-dock', WishlistDock);
  }
};

window.registerWishlistDock = registerWishlistDock;
