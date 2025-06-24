describe("Driver Flow", () => {
	beforeEach(() => {
		cy.clearLocalStorage();
	});

	it("Login Driver", () => {
		cy.visit("/");

		cy.get("#email").type("john.doe@utec.edu.pe");
		cy.get("#password").type("123456");
		cy.get("#loginSubmit").click();

		cy.url({ timeout: 10000 }).should("include", "/dashboard");

		cy.window().then((window) => {
			const token = window.localStorage.getItem("token");
			Cypress.env("authToken", token);
		});

		cy.wait(2000);

		cy.get("#profileNames").should("have.text", "John Doe");
		cy.get("#profileEmail").should("have.text", "john.doe@utec.edu.pe");
		cy.get("#profilePhone").should("have.text", "999999999");

		cy.get("#vehicleModel").should("have.text", "Toyota Yaris");
		cy.get("#driverCategory").should("have.text", "Categoría: X");
		cy.get("#licenseNumber").should("have.text", "Placa: ABC-123");
		cy.get("#yearOfFabrication").should(
			"have.text",
			"Año de fabricación: 2020",
		);
		cy.get("#capacityNumber").should("have.text", "Capacidad: 5");
	});

	it("Edit Vehicle", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.visit("/dashboard");

		cy.get("#editVehicle").click();

		cy.url().should("include", "/vehicle/edit");

		cy.get("#brand").clear().type("Hyundai");
		cy.get("#model").clear().type("Elantra");
		cy.get("#licensePlate").clear().type("ABC140");
		cy.get("#fabricationYear").clear().type("2021");
		cy.get("#capacity").clear().type("6");
		cy.get("#vehicleSubmit").click();

		cy.url().should("include", "/dashboard");

		cy.wait(2000);

		cy.get("#vehicleModel").should("have.text", "Hyundai Elantra");
		cy.get("#licenseNumber").should("have.text", "Placa: ABC140");
		cy.get("#yearOfFabrication").should(
			"have.text",
			"Año de fabricación: 2021",
		);
		cy.get("#capacityNumber").should("have.text", "Capacidad: 6");
	});

	it("Re-edit Vehicle", () => {
		const token = Cypress.env("authToken");

		cy.window().then((window) => {
			window.localStorage.setItem("token", token);
		});

		cy.visit("/dashboard");

		cy.get("#editVehicle").click();
		cy.url().should("include", "/vehicle/edit");

		cy.get("#brand").clear().type("Toyota");
		cy.get("#model").clear().type("Yaris");
		cy.get("#licensePlate").clear().type("ABC-123");
		cy.get("#fabricationYear").clear().type("2020");
		cy.get("#capacity").clear().type("5");
		cy.get("#vehicleSubmit").click();

		cy.url().should("include", "/dashboard");

		cy.wait(2000);

		cy.get("#vehicleModel").should("have.text", "Toyota Yaris");
		cy.get("#licenseNumber").should("have.text", "Placa: ABC-123");
		cy.get("#yearOfFabrication").should(
			"have.text",
			"Año de fabricación: 2020",
		);
		cy.get("#capacityNumber").should("have.text", "Capacidad: 5");
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
