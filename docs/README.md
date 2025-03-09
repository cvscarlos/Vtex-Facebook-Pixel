# Vtex Facebook Pixel

An app for the [Vtex Ecommerce Platform](https://vtex.com/us-en) (*NYSE: VTEX*) that simplifies the integration of your store with Facebook Pixel.

## Tracked Events

The following events are tracked by this app:

- **`PageView`**: Triggered when a user views a page.
- **`ProductView`**: Triggered when a user views a product page.
- **`CategoryView` / `ViewContent`**: Triggered when a user views a category page.
- **`Search`**: Triggered when a user performs a search.
- **`AddToCart`**: Triggered when a product is added to the cart.
- **`Purchase`**: Triggered when an order is placed.

For more details about these events, refer to the [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/api-reference).

---

## Installation

1. **Install the app**:
    - **Option 1**: Download this repository and use the [Vtex CLI](https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-install):
      ```sh
      vtex publish
      vtex install easygopartnerbr.cvs-facebook-pixel@2.x
      ```
    - **Option 2**: Access the installation URL directly:
      ```plaintext
      https://{{accountName}}.myvtex.com/admin/apps/easygopartnerbr.cvs-facebook-pixel/install
      ```

2. **Access the setup URL**:
    ```plaintext
    https://{{accountName}}.myvtex.com/admin/apps/easygopartnerbr.cvs-facebook-pixel/setup
    ```

3. **Fill out the form**:
    - Provide your **Facebook Pixel ID**.
    - Provide your **Facebook Campaign Access Token** ([see documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started/?locale=en_US#access-token) for details, scroll to *"Business Manager > Step 3"*).
    - Click the **"Save"** button.

---

## User Data Privacy

**Important**: Ensure your store's privacy policy is updated to reflect that you are collecting and sharing user data with Facebook.

---

## Development

### Requirements
- The Vtex environment requires **Node v12**, but this app is also compatible with **Node v14**.
- Use **Yarn Classic (v1)** to install dependencies:
  ```sh
  npx yarn@1 install
  ```

### Getting Started
- To start the development server, run:
  ```sh
  vtex link
  ```

### Notes
- **`npm workspaces`** is not supported by Vtex.
- Ensure you have a `yarn.lock` file in both the `react` and `node` folders.
- Run the following commands to generate the `yarn.lock` files:
  ```sh
  cd react && npx yarn@1 install && cd ..
  cd node && npx yarn@1 install && cd ..
  ```
- At the root folder, you can use `yarn` or `npx` with any Node version.
