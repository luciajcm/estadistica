describe("Login Passenger", () => {
	beforeEach(() => {
		cy.clearLocalStorage();
	});

	it("login successfully", () => {
		cy.visit("/");

		cy.get("#email").type("jmonja@utec.edu.pe");
		cy.get("#password").type("123456");
		cy.get("#loginSubmit").click();

		cy.url().should("include", "/dashboard");

		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			Cypress.env("authToken", token);
		});

		cy.get("#profileNames").should("have.text", "Jeffrey Monja");
		cy.get("#profileEmail").should("have.text", "jmonja@utec.edu.pe");
		cy.get("#profilePhone").should("have.text", "987654321");
	});

	it("Rides History", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.visit("/dashboard");

		cy.get("#ridesHistorial").children().should("have.length", 2);
		cy.get("#1").should("exist");
		cy.get("#1  > :nth-child(1) > #origin").should("have.text", "SMP");
		cy.get("#1  > :nth-child(3) > #destination").should("have.text", "Callao");
		cy.get("#1  > :nth-child(4) > #price").should("have.text", "19.7");
	});

	it("Edit Profile", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.visit("/dashboard");

		cy.get("#editProfile").click();
		cy.wait(2000);

		cy.url().should("include", "/profile/edit");

		cy.get("#firstName").clear().type("Jeff");
		cy.get("#lastName").clear().type("Castro");
		cy.get("#phoneNumber").clear().type("999999999");
		cy.get("#updateSubmit").click();

		cy.url().should("include", "/dashboard");

		cy.wait(2000);

		cy.get("#profileNames").should("have.text", "Jeff Castro");
		cy.get("#profilePhone").should("have.text", "999999999");
	});

	it("Re-edit Profile", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.visit("/dashboard");

		cy.get("#editProfile").click();
		cy.url().should("include", "/profile/edit");

		cy.get("#firstName").clear().type("Jeffrey");
		cy.get("#lastName").clear().type("Monja");
		cy.get("#phoneNumber").clear().type("987654321");
		cy.get("#updateSubmit").click();

		cy.url().should("include", "/dashboard");

		cy.wait(2000);

		cy.get("#profileNames").should("have.text", "Jeffrey Monja");
		cy.get("#profilePhone").should("have.text", "987654321");
	});

	it("Logout", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.window().its("localStorage.token").should("eq", token);

		cy.visit("/dashboard");

		cy.get("#logout").click();

		cy.url().should("include", "/auth/login");

		// Verificar que el token se haya eliminado del localStorage
		cy.window().its("localStorage.token").should("be.undefined");
	});
});
