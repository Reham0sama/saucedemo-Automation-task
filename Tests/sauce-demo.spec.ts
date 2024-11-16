import { test, expect } from '@playwright/test';

test.describe('Sauce Labs Demo App', () => {

    // Login Functionality Tests
    test.describe('Login Tests', () => {
        test('Login with valid credentials', async ({ page }) => {
            await page.goto('/');
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
            await page.click('#login-button');
            await expect(page).toHaveURL('/inventory.html');
        });

        test('Login with invalid credentials', async ({ page }) => {
            await page.goto('/');
            await page.fill('#user-name', 'invalid_user');
            await page.fill('#password', 'wrong_password');
            await page.click('#login-button');
            const errorMessage = await page.locator('[data-test="error"]');
            await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
        });
    });

    // Product Page Tests
    test.describe('Product Page Tests', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
            await page.click('#login-button');
        });

        test('Verify all products are displayed', async ({ page }) => {
            const products = await page.locator('.inventory_item');
            await expect(products).toHaveCount(6); // Assuming 6 products
        });

        test('Validate product details', async ({ page }) => {
            const firstProduct = page.locator('.inventory_item').first();
            await expect(firstProduct.locator('.inventory_item_name')).toBeVisible();
            await expect(firstProduct.locator('.inventory_item_desc')).toBeVisible();
            await expect(firstProduct.locator('.inventory_item_price')).toBeVisible();
        });

        test('Test sorting functionality', async ({ page }) => {
            await page.selectOption('.product_sort_container', 'lohi'); // Low to High
            const prices = await page.$$eval('.inventory_item_price', items => items.map(i => parseFloat(i.textContent!.replace('$', ''))));
            expect(prices).toEqual([...prices].sort((a, b) => a - b));
        });
    });

    // Shopping Cart Tests
    test.describe('Shopping Cart Tests', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
            await page.click('#login-button');
        });

        test('Add product to the cart', async ({ page }) => {
            await page.click('#add-to-cart-sauce-labs-bike-light');
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toHaveText('1');
        });

        test('Remove product from the cart', async ({ page }) => {
           // await page.click('#add-to-cart-sauce-labs-backpack');
           await page.click('#add-to-cart-sauce-labs-bike-light');
            await page.click('#remove-sauce-labs-bike-light'); // Remove the same item
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toBeHidden();
        });

        test('Verify cart badge updates correctly', async ({ page }) => {
            await page.click('#add-to-cart-sauce-labs-backpack');
            await page.click('#add-to-cart-sauce-labs-bike-light');
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toHaveText('2');
        });
    });

    // User Logout Test
    test.describe('Logout Test', () => {
        test('Verify logout functionality', async ({ page }) => {
            await page.goto('/');
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
            await page.click('#login-button');
            await page.click('#react-burger-menu-btn');
            await page.click('#logout_sidebar_link');
            await expect(page).toHaveURL('/');
        });
    });

});
