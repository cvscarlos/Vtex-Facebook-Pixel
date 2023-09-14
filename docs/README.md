# Vtex Facebook Pixel

An app for [Vtex Ecommerce platform](https://vtex.com/us-en) (*NYSE: VTEX*) that makes it easy to integrate your store with Facebook Pixel.


## Tracked Events
- `PageView`: triggered when the user views a page;
- `ProductView`: triggered when the user views a product page;
- `AddToCart`: triggered when a product is added to the cart;
- `Purchase`: triggered when an order is placed.

More details about the events can be found in the [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/api-reference).


## Instalation
1. Install it:
    - downloading this repository and using [Vtex CLI](https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-install):
        ```sh
        vtex install maeztraio.cvs-facebook-pixel@1.x
        ```
    - Or access the URL:
        ```plain
        https://{{accountName}}.myvtex.com/admin/apps/maeztraio.cvs-facebook-pixel/install
        ```
3. Access the setup URL:
    ```plain
    https://{{accountName}}.myvtex.com/admin/apps/maeztraio.cvs-facebook-pixel/setup
    ```
4. Fill the form with your:
    - Facebook Pixel ID;
    - Facebook Campaign Access Token ([details on documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started/?locale=en_US#access-token), scroll to *"Business Manager > Step 3"*);
    - Press the "Save" button.


## User Data Privacy
Remember you must update your store's privacy policy to include the fact that you are collecting and sharing user data with Facebook.


## Development
- The Vtex environment requires Node v12, but this app also works fine in Node v14;
- Use Yarn Classic (v1) to install dependencies by running `npx yarn@1 install`;
- To start the development server, run `vtex link`.


## Special Thanks
I would like to thank [Maeztra](https://maeztra.com/) for providing me with a test environment to develop this app.
