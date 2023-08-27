# Vtex Facebook Pixel

This is an app for [Vtex Ecommerce platform](https://vtex.com/us-en) (*NYSE: VTEX*) that helps you easily integrate your store with Facebook Pixel.


### Tracked Events
- `PageView`: This event is triggered when the user views a page;
- `ProductView`: This event is triggered when the user views a product page;
- `AddToCart`: This event is triggered when the product is added to the cart;
- `Purchase`: This event is triggered when the order is placed.

More details about the events can be found at [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/api-reference).


### Instalation
Download this repository and install via Vtex CLI:
```sh
vtex install maeztraio.cvs-facebook-pixel@1.x
```

OR access the app installation URL:
```plain
https://{{accountName}}.myvtex.com/admin/apps/maeztraio.cvs-facebook-pixel@1.x/setup/
```


### User Data Privacy
Remember you must update your store's privacy policy to include the fact you are collecting and sharing user data with Facebook.

### Special Thanks
I would like to thank [Maeztra](https://maeztra.com/) for providing me a test environment to develop and publish this app.
