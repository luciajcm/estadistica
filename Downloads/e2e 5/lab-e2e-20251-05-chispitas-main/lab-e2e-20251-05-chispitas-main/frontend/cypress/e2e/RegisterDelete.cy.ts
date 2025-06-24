describe("Register and delete Passenger", () => {
	beforeEach(() => {
		cy.clearLocalStorage();

		cy.on("fail", (error, _) => {
			console.error("Test failed:", error.message);
			throw error; // Para que Cypress siga manejando el error después de imprimirlo
		});
	});

	it("Register successfully", () => {
		cy.visit("/auth/register");

		cy.get("#firstName").type("Walter");
		cy.get("#lastName").type("White");
		cy.get("#email").type("walter.white@gmail.com");
		cy.get("#password").type("metanfetamina");
		cy.get("#phone").type("987654321");
		cy.get("#passenger").check();
		cy.get("#registerSubmit").click();

		cy.wait(2000);
		cy.url().should("include", "/dashboard");

		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			Cypress.env("authToken", token);
		});
	});

	it("Delete Passenger", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.window().its("localStorage.token").should("eq", token);
		cy.visit("/dashboard");

		cy.get("#editProfile").click();
		cy.url().should("include", "/profile/edit");

		cy.wait(2000);
		cy.get("#deleteUser").click();
		cy.url().should("include", "/auth/login");

		cy.window().its("localStorage.token").should("be.undefined");
	});
});

describe("Register and delete Driver", () => {
	beforeEach(() => {
		cy.clearLocalStorage();

		cy.on("fail", (error, _) => {
			console.error("Test failed:", error.message);
			throw error; // Para que Cypress siga manejando el error después de imprimirlo
		});
	});

	it("Register successfully", () => {
		cy.visit("/auth/register");

		cy.get("#firstName").type("Walter");
		cy.get("#lastName").type("Black");
		cy.get("#email").type("walter.black@gmail.edu.pe");
		cy.get("#password").type("metanfetamina");
		cy.get("#phone").type("987654321");
		cy.get("#driver").check();
		cy.get("#registerSubmit").click();

		cy.get("#category").select("XL");
		cy.get("#brand").type("Lamborghini");
		cy.get("#model").type("Aventador");
		cy.get("#licensePlate").type("XYZ123");
		cy.get("#fabricationYear").type("2024");
		cy.get("#capacity").type("2");
		cy.get("#registerVehicleSubmit").click();

		cy.wait(2000);
		cy.url().should("include", "/dashboard");

		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			Cypress.env("authToken", token);
		});
	});

	it("Delete Driver", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.window().its("localStorage.token").should("eq", token);
		cy.visit("/dashboard");

		cy.get("#editProfile").click();
		cy.url().should("include", "/profile/edit");

		cy.wait(2000);
		cy.get("#deleteUser").click();

		cy.url().should("include", "/auth/login");

		cy.window().its("localStorage.token").should("be.undefined");
	});
});
