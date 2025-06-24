describe("Not Found page", () => {
	it("Should show not found page", () => {
		cy.visit("/auth/login");
		cy.visit("/not-found");

		cy.get("#notFound").should("contain.text", "404");
		cy.get("#historyBack").click();

		cy.url().should("include", "/auth/login");
	});
});
