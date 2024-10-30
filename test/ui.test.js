const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('UI Testing using Selenium', function() {
    this.timeout(10000); // Batas waktu hook before all

    before(async function() {
        try {
            console.log('Membangun WebDriver...');
            driver = await new Builder().forBrowser('chrome').build();
            console.log('WebDriver berhasil dibangun.');
            await driver.get('http://localhost:8080/login.html'); // Pastikan URL ini benar
        } catch (error) {
            console.error('Error during setup:', error);
            throw error; // Menyebabkan pengujian gagal
        }
    });    

    it('should input username and password using CSS Selector', async function() {
        await driver.findElement(By.css('#username')).sendKeys('testuser');
        await driver.findElement(By.css('#password')).sendKeys('password123');
    });

    it('should click the login button', async function() {
        await driver.findElement(By.id('loginButton')).click();
        try {
            await driver.switchTo().alert().accept();
        } catch (error) {
            console.error('No alert to accept:', error);
        }
    });

    it('should fail to login with invalid credentials', async function() {
        await driver.findElement(By.css('#username')).sendKeys('wronguser');
        await driver.findElement(By.css('#password')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginButton')).click();

        // Tunggu hingga elemen pesan error muncul
        const errorMessageElement = await driver.wait(until.elementLocated(By.id('errorMessage')), 5000);
        const errorMessage = await errorMessageElement.getText();
        expect(errorMessage).to.equal('Invalid username or password.');
    });

    it('should validate visual elements', async function() {
        const isDisplayed = await driver.findElement(By.id('loginButton')).isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    after(async function() {
        if (driver) {
            console.log('Menutup WebDriver...');
            await driver.quit();
            console.log('WebDriver ditutup.');
        } else {
            console.warn('Driver tidak ada, tidak ada yang perlu ditutup.');
        }
    });
});