'use strict';
import TestHelpers from './helpers';

const CORRECT_SEED_WORDS = 'fold media south add since false relax immense pause cloth just raven';
const CORRECT_PASSWORD = `12345678`;
const ROPSTEN = 'Ropsten Test Network';
const ROPSTEN_FAUCET = 'https://faucet.metamask.io';
const TEST_DAPP_URL = 'https://metamask.github.io/test-dapp/';
const TEST_DAPP_TITLE = 'E2E Test Dapp';
const ETH_FAUCET = 'Test Ether Faucet';
const DAPP_ACCESS = 'Allow metamask.github.io to access your TST?';

describe('Test Dapp Initiated Transactions', () => {
	beforeEach(() => {
		jest.setTimeout(150000);
	});

	it('should import wallet via seed phrase', async () => {
		// Check that we are on the onboarding carousel screen
		await TestHelpers.checkIfVisible('onboarding-carousel-screen');
		// Check that Get started CTA is visible & tap it
		await TestHelpers.waitAndTap('onboarding-get-started-button');
		// Check that we are on the onboarding screen
		await TestHelpers.checkIfVisible('onboarding-screen');
		// Check that Sync or import your wallet CTA is visible & tap it
		await TestHelpers.waitAndTap('onboarding-import-button');
		// Check that we are on the import wallet screen
		await TestHelpers.checkIfVisible('import-wallet-screen');
		// Check that Import using seed phrase CTA is visible & tap it
		await TestHelpers.waitAndTap('import-wallet-import-from-seed-button');
		// Check that we are on the import from seed screen
		await TestHelpers.checkIfVisible('import-from-seed-screen');
		// Input seed phrase
		await TestHelpers.typeTextAndHideKeyboard(`input-seed-phrase`, CORRECT_SEED_WORDS);
		// Input password
		await TestHelpers.typeTextAndHideKeyboard(`input-password-field`, CORRECT_PASSWORD);
		// Input password confirm
		await TestHelpers.typeTextAndHideKeyboard(`input-password-field-confirm`, CORRECT_PASSWORD);
		// Check that we are on the metametrics optIn screen
		await TestHelpers.checkIfVisible('metaMetrics-OptIn');
		// Check that I Agree CTA is visible and tap it
		await TestHelpers.waitAndTap('agree-button', 15000);
		// Should be on wallet screen
		if (!device.getPlatform() === 'android') {
			// Check that we are on the wallet screen
			await TestHelpers.checkIfExists('wallet-screen');
		}
		// Check that the onboarding wizard is present
		await TestHelpers.checkIfVisible('onboarding-wizard-step1-view');
		// Check that No thanks CTA is visible and tap it
		await TestHelpers.waitAndTap('onboarding-wizard-back-button');
		// Check that the onboarding wizard is gone
		await TestHelpers.checkIfNotVisible('onboarding-wizard-step1-view');
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '0 ETH');
	});

	it('should switch to ropsten network and validate ETH value', async () => {
		// Tap on Ethereum Main Network to prompt modal
		await TestHelpers.waitAndTap('open-networks-button');
		// Check that the Networks modal pops up
		await TestHelpers.checkIfVisible('networks-list');
		// Tap on Ropsten Test Nework
		await TestHelpers.tapByText(ROPSTEN);
		// Check that we are on Ropsten network
		await TestHelpers.checkIfElementWithTextIsVisible(ROPSTEN);
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '1.9');
	});

	it('should go to browser and navigate to MM Ropsten faucet', async () => {
		// Open Drawer
		await TestHelpers.tap('hamburger-menu-button-wallet');
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Browser
		await TestHelpers.tapByText('Browser');
		// Wait for page to load
		await TestHelpers.delay(2000);
		// Check that we are on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap on search in bottom navbar
		await TestHelpers.tap('search-button');
		// Navigate to URL
		if (device.getPlatform() === 'ios') {
			await TestHelpers.typeTextAndHideKeyboard('url-input', ROPSTEN_FAUCET);
			await TestHelpers.delay(8500);
		} else {
			await TestHelpers.replaceTextInField('url-input', ROPSTEN_FAUCET);
			await element(by.id('url-input')).tapReturnKey();
			await TestHelpers.delay(8500);
		}
		// Check that we are still on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
	});

	it('should donate ETH on MM Ropsten', async () => {
		// Tap to donate 1 ETH
		if (device.getPlatform() === 'android') {
			await TestHelpers.tapAtPoint('browser-screen', { x: 65, y: 176 });
			await TestHelpers.delay(2000);
		} else {
			await TestHelpers.tapAtPoint('browser-screen', { x: 76, y: 189 });
		}
		// Check that account approval is displayed with correct dapp name
		await TestHelpers.checkIfHasText('dapp-name-title', ETH_FAUCET);
		// Tap on CONNECT button
		await TestHelpers.tapByText('CONNECT');
		// Check that we are on the confirm transaction screen
		await TestHelpers.checkIfVisible('confirm-transaction-screen');
		// Tap Edit
		await TestHelpers.tap('confirm-txn-edit-button');
		// Input Amount
		await TestHelpers.replaceTextInField('amount-input', '0.000001');
		// Tap on FAST for transaction fee
		await TestHelpers.tapByText('FAST');
		// Tap on NEXT button
		await TestHelpers.tapByText('Next');
		// Tap on CONFIRM button
		await TestHelpers.tapByText('Confirm');
		// Wait for enable notifications alert to show up
		if (device.getPlatform() === 'ios') {
			// Check that we are on the browser screen
			await TestHelpers.checkIfVisible('browser-screen');
			// Wait for enable notifications alert to show up
			await TestHelpers.delay(10000);
			// Dismiss alert
			await TestHelpers.tapAlertWithButton('No, thanks');
		}
		// Open Drawer
		await TestHelpers.tap('hamburger-menu-button-browser');
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Wallet
		await TestHelpers.tapByText('Wallet');
		// Check that we are on the wallet screen
		await TestHelpers.checkIfVisible('wallet-screen');
		// Ensure ETH Value is correct
		await TestHelpers.checkIfElementHasString('balance', '1.9 ETH');
	});

	it('should be able to go to account two', async () => {
		// Tap on account icon to prompt modal
		await TestHelpers.tap('wallet-account-identicon');
		// Check that the account list view is visible
		await TestHelpers.checkIfVisible('account-list');
		// Tap on Create New Account
		await TestHelpers.waitAndTap('create-account-button');
		// Check if account was added
		await TestHelpers.checkIfElementWithTextIsVisible('Account 2');
		// Dismiss account list
		if (device.getPlatform() === 'ios') {
			// Check that we are on the wallet screen
			await TestHelpers.swipe('account-list-dragger', 'down');
		} else {
			await device.pressBack();
		}
	});

	it('should navigate to test dapp repo to perform transactions', async () => {
		// Open Drawer
		await TestHelpers.tap('hamburger-menu-button-wallet');
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on browser
		await TestHelpers.tapByText('Browser');
		// Wait for page to load
		await TestHelpers.delay(1000);
		// Check that we are on the browser screen
		await TestHelpers.checkIfVisible('browser-screen');
		// Tap on options
		await TestHelpers.waitAndTap('options-button');
		// Tap on New tab
		await TestHelpers.tapByText('New tab');
		// Tap on search in bottom navbar
		await TestHelpers.tap('search-button');
		// Navigate to URL
		if (device.getPlatform() === 'ios') {
			await TestHelpers.typeTextAndHideKeyboard('url-input', TEST_DAPP_URL);
			await TestHelpers.delay(3500);
		} else {
			await TestHelpers.replaceTextInField('url-input', TEST_DAPP_URL);
			await element(by.id('url-input')).tapReturnKey();
			await TestHelpers.delay(3500);
		}

		// Tap on connect button to bring up connection request
		if (device.getPlatform() === 'android') {
			await TestHelpers.tapAtPoint('browser-screen', { x: 183, y: 261 });
			await TestHelpers.delay(1000);
		} else {
			await TestHelpers.tapAtPoint('browser-screen', { x: 191, y: 267 });
		}
		// Give some time for connect request
		await TestHelpers.delay(1000);
		// Check that account approval is displayed with correct dapp name
		await TestHelpers.checkIfHasText('dapp-name-title', TEST_DAPP_TITLE);
		// Tap on CONNECT button
		await TestHelpers.tapByText('CONNECT');
		// Give some time for account to be displayed
		await TestHelpers.delay(2000);

		// Scroll to bottom of browser view and create token then approve token
		if (device.getPlatform() === 'ios') {
			// Scroll down to bottom of page
			await TestHelpers.swipe('browser-screen', 'up');
			await TestHelpers.delay(1000);
			// Tap on Create Token button
			await TestHelpers.tapAtPoint('browser-screen', { x: 225, y: 505 });
			// Tap Edit
			await TestHelpers.tap('confirm-txn-edit-button');
			// Tap on FAST for transaction fee
			await TestHelpers.tapByText('FAST');
			// Tap on NEXT button
			await TestHelpers.tapByText('Next');
			// Tap on CONFIRM button
			await TestHelpers.tapByText('Confirm');
			// on iOS dismiss notification
			// Check that we are on the browser screen
			await TestHelpers.checkIfVisible('browser-screen');
			// Wait for enable notifications alert to show up
			await TestHelpers.delay(10000);
			// Dismiss alert
			await TestHelpers.tapAlertWithButton('No, thanks');
			// Tap on Approve Tokens button
			await TestHelpers.tapAtPoint('browser-screen', { x: 229, y: 553 });
			// Check that we are on the approve screen
			await TestHelpers.checkIfVisible('approve-screen');
			// Check that title is correct
			await TestHelpers.checkIfElementHasString('allow-access', DAPP_ACCESS);
			// Tap on Approve button
			await TestHelpers.tapAtPoint('approve-screen', { x: 330, y: 600 });
			// Give enough time for notification to go away
			await TestHelpers.delay(1000);
		}
	});

	it('should log out', async () => {
		// Open Drawer
		await TestHelpers.tap('hamburger-menu-button-browser');
		// Check that the drawer is visbile
		await TestHelpers.checkIfVisible('drawer-screen');
		// Tap on Log Out
		await TestHelpers.tapByText('Log Out');
		// Tap YES
		await TestHelpers.tapAlertWithButton('YES');
		// Check that we are on the login screen
		await TestHelpers.checkIfVisible('login');
	});
});
