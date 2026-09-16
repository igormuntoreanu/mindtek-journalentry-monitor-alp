"use strict";

const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "webapp", "localService", "mockdata");
fs.mkdirSync(outDir, { recursive: true });

function odataDate(date) {
	return "/Date(" + date.getTime() + ")/";
}

const VALID_TO = odataDate(new Date(Date.UTC(9999, 11, 31)));
const VALID_FROM = odataDate(new Date(Date.UTC(2020, 0, 1)));
const CREATED_ON = odataDate(new Date(Date.UTC(2024, 0, 15)));

const companies = [
	{ CompanyCode: "UK01", CompanyCodeName: "MindTek UK", CityName: "London", Country: "GB", Currency: "GBP", Language: "EN", ChartOfAccounts: "YCOA", FiscalYearVariant: "K4", Company: "MTUK", ControllingArea: "A000", VATRegistration: "GB123456789" },
	{ CompanyCode: "BR01", CompanyCodeName: "MindTek Brasil", CityName: "Sao Paulo", Country: "BR", Currency: "BRL", Language: "PT", ChartOfAccounts: "YCOA", FiscalYearVariant: "K4", Company: "MTBR", ControllingArea: "A000", VATRegistration: "BR112223330001" },
	{ CompanyCode: "DE01", CompanyCodeName: "MindTek DACH", CityName: "Munich", Country: "DE", Currency: "EUR", Language: "DE", ChartOfAccounts: "YCOA", FiscalYearVariant: "K4", Company: "MTDE", ControllingArea: "A000", VATRegistration: "DE987654321" },
	{ CompanyCode: "US01", CompanyCodeName: "MindTek US", CityName: "New York", Country: "US", Currency: "USD", Language: "EN", ChartOfAccounts: "YCOA", FiscalYearVariant: "K4", Company: "MTUS", ControllingArea: "A000", VATRegistration: "US98-7654321" }
];

const toGbp = { GBP: 1, EUR: 0.85, USD: 0.78, BRL: 0.14 };

const glAccounts = [
	{ GLAccount: "110000", GLAccountName: "Bank / Cash", IsBalanceSheetAccount: true, GLAccountGroup: "CASH", GLAccountType: "C", IsProfitLossAccount: false },
	{ GLAccount: "140000", GLAccountName: "Accounts Receivable", IsBalanceSheetAccount: true, GLAccountGroup: "AR", GLAccountType: "N", IsProfitLossAccount: false },
	{ GLAccount: "160000", GLAccountName: "Accounts Payable", IsBalanceSheetAccount: true, GLAccountGroup: "AP", GLAccountType: "N", IsProfitLossAccount: false },
	{ GLAccount: "211000", GLAccountName: "Payroll Liability", IsBalanceSheetAccount: true, GLAccountGroup: "LIAB", GLAccountType: "N", IsProfitLossAccount: false },
	{ GLAccount: "400000", GLAccountName: "Consulting Revenue", IsBalanceSheetAccount: false, GLAccountGroup: "REV", GLAccountType: "X", IsProfitLossAccount: true },
	{ GLAccount: "410000", GLAccountName: "License Revenue", IsBalanceSheetAccount: false, GLAccountGroup: "REV", GLAccountType: "X", IsProfitLossAccount: true },
	{ GLAccount: "500000", GLAccountName: "Cost of Services", IsBalanceSheetAccount: false, GLAccountGroup: "COGS", GLAccountType: "P", IsProfitLossAccount: true },
	{ GLAccount: "510000", GLAccountName: "Payroll Expense", IsBalanceSheetAccount: false, GLAccountGroup: "EXP", GLAccountType: "P", IsProfitLossAccount: true },
	{ GLAccount: "520000", GLAccountName: "Rent Expense", IsBalanceSheetAccount: false, GLAccountGroup: "EXP", GLAccountType: "P", IsProfitLossAccount: true },
	{ GLAccount: "530000", GLAccountName: "Utilities Expense", IsBalanceSheetAccount: false, GLAccountGroup: "EXP", GLAccountType: "P", IsProfitLossAccount: true },
	{ GLAccount: "540000", GLAccountName: "Travel Expense", IsBalanceSheetAccount: false, GLAccountGroup: "EXP", GLAccountType: "P", IsProfitLossAccount: true },
	{ GLAccount: "550000", GLAccountName: "Software Licences", IsBalanceSheetAccount: false, GLAccountGroup: "EXP", GLAccountType: "P", IsProfitLossAccount: true }
];

const costCenters = [
	{ CostCenter: "UKSALES", CostCenterName: "UK Sales", CompanyCode: "UK01", Department: "Sales", CityName: "London", Country: "GB", Person: "N. Braga" },
	{ CostCenter: "UKDELIV", CostCenterName: "UK Delivery", CompanyCode: "UK01", Department: "Delivery", CityName: "London", Country: "GB", Person: "I. Muntoreanu" },
	{ CostCenter: "UKADMIN", CostCenterName: "UK Admin", CompanyCode: "UK01", Department: "Admin", CityName: "London", Country: "GB", Person: "N. Braga" },
	{ CostCenter: "BRSALES", CostCenterName: "BR Sales", CompanyCode: "BR01", Department: "Sales", CityName: "Sao Paulo", Country: "BR", Person: "N. Braga" },
	{ CostCenter: "BRDELIV", CostCenterName: "BR Delivery", CompanyCode: "BR01", Department: "Delivery", CityName: "Sao Paulo", Country: "BR", Person: "I. Muntoreanu" },
	{ CostCenter: "DEDELIV", CostCenterName: "DACH Delivery", CompanyCode: "DE01", Department: "Delivery", CityName: "Munich", Country: "DE", Person: "I. Muntoreanu" },
	{ CostCenter: "USADMIN", CostCenterName: "US Admin", CompanyCode: "US01", Department: "Admin", CityName: "New York", Country: "US", Person: "N. Braga" }
];

const profitCenters = [
	{ ProfitCenter: "PCUK", ProfitCenterName: "UK Operations", CompanyCode: "UK01", Country: "GB", CityName: "London", Person: "N. Braga" },
	{ ProfitCenter: "PCBR", ProfitCenterName: "Brazil Operations", CompanyCode: "BR01", Country: "BR", CityName: "Sao Paulo", Person: "N. Braga" },
	{ ProfitCenter: "PCDE", ProfitCenterName: "DACH Operations", CompanyCode: "DE01", Country: "DE", CityName: "Munich", Person: "I. Muntoreanu" },
	{ ProfitCenter: "PCUS", ProfitCenterName: "US Operations", CompanyCode: "US01", Country: "US", CityName: "New York", Person: "N. Braga" }
];

const companyCodesJson = companies.map((c) => ({
	CompanyCode: c.CompanyCode,
	CompanyCodeName: c.CompanyCodeName,
	CityName: c.CityName,
	Country: c.Country,
	Currency: c.Currency,
	Language: c.Language,
	ChartOfAccounts: c.ChartOfAccounts,
	FiscalYearVariant: c.FiscalYearVariant,
	Company: c.Company,
	CreditControlArea: c.CompanyCode,
	CountryChartOfAccounts: null,
	FinancialManagementArea: "A000",
	AddressID: null,
	TaxableEntity: c.CompanyCode,
	VATRegistration: c.VATRegistration,
	ExtendedWhldgTaxIsActive: false,
	ControllingArea: c.ControllingArea,
	FieldStatusVariant: "0001",
	NonTaxableTransactionTaxCode: "A0",
	DocDateIsUsedForTaxDetn: false,
	TaxRptgDateIsActive: false
}));

const costCentersJson = costCenters.map((cc) => ({
	ControllingArea: "A000",
	CostCenter: cc.CostCenter,
	ValidityEndDate: VALID_TO,
	ValidityStartDate: VALID_FROM,
	CompanyCode: cc.CompanyCode,
	BusinessArea: null,
	CostCtrResponsiblePersonName: cc.Person,
	CostCtrResponsibleUser: "IMUNTOREANU",
	CostCenterCurrency: companies.find((c) => c.CompanyCode === cc.CompanyCode).Currency,
	ProfitCenter: profitCenters.find((p) => p.CompanyCode === cc.CompanyCode).ProfitCenter,
	Department: cc.Department,
	CostingSheet: null,
	FunctionalArea: "YB40",
	Country: cc.Country,
	Region: null,
	CityName: cc.CityName,
	CostCenterStandardHierArea: "H1",
	CostCenterCategory: "E",
	IsBlkdForPrimaryCostsPosting: "",
	IsBlkdForSecondaryCostsPosting: "",
	IsBlockedForRevenuePosting: "",
	IsBlockedForCommitmentPosting: "",
	IsBlockedForPlanPrimaryCosts: "",
	IsBlockedForPlanSecondaryCosts: "",
	IsBlockedForPlanRevenues: "",
	ConsumptionQtyIsRecorded: "",
	Language: "EN",
	CostCenterCreatedByUser: "IMUNTOREANU",
	CostCenterCreationDate: CREATED_ON
}));

const profitCentersJson = profitCenters.map((pc) => ({
	ControllingArea: "A000",
	ProfitCenter: pc.ProfitCenter,
	ValidityEndDate: VALID_TO,
	ProfitCtrResponsiblePersonName: pc.Person,
	CompanyCode: pc.CompanyCode,
	ProfitCtrResponsibleUser: "IMUNTOREANU",
	ValidityStartDate: VALID_FROM,
	Department: "Finance",
	ProfitCenterStandardHierarchy: "H1",
	Segment: pc.CompanyCode,
	ProfitCenterIsBlocked: "",
	FormulaPlanningTemplate: null,
	FormOfAddress: "Company",
	AddressName: pc.ProfitCenterName,
	AdditionalName: null,
	ProfitCenterAddrName3: null,
	ProfitCenterAddrName4: null,
	StreetAddressName: "SAP Way 1",
	POBox: null,
	CityName: pc.CityName,
	PostalCode: "00000",
	District: null,
	Country: pc.Country,
	Region: null,
	TaxJurisdiction: null,
	Language: "EN",
	PhoneNumber1: null,
	PhoneNumber2: null,
	TeleboxNumber: null,
	TelexNumber: null,
	FaxNumber: null,
	DataCommunicationPhoneNumber: null,
	ProfitCenterPrinterName: null,
	ProfitCenterCreatedByUser: "IMUNTOREANU",
	ProfitCenterCreationDate: CREATED_ON
}));

const glJson = glAccounts.map((g) => ({
	ChartOfAccounts: "YCOA",
	GLAccount: g.GLAccount,
	IsBalanceSheetAccount: g.IsBalanceSheetAccount,
	GLAccountGroup: g.GLAccountGroup,
	CorporateGroupAccount: g.GLAccount,
	ProfitLossAccountType: g.IsProfitLossAccount ? "X" : "",
	SampleGLAccount: null,
	AccountIsMarkedForDeletion: false,
	AccountIsBlockedForCreation: false,
	AccountIsBlockedForPosting: false,
	AccountIsBlockedForPlanning: false,
	PartnerCompany: null,
	FunctionalArea: g.IsProfitLossAccount ? "YB40" : null,
	CreationDate: CREATED_ON,
	CreatedByUser: "IMUNTOREANU",
	LastChangeDateTime: null,
	GLAccountType: g.GLAccountType,
	GLAccountExternal: g.GLAccount,
	IsProfitLossAccount: g.IsProfitLossAccount
}));

function pad(n, w) {
	return String(n).padStart(w, "0");
}

function pick(arr, i) {
	return arr[i % arr.length];
}

const items = [];
const years = [2024, 2025, 2026];
let seq = 1;

for (let n = 0; n < 420; n++) {
	const company = pick(companies, n);
	const year = years[n % years.length];
	const period = (n % 12) + 1;
	const gl = pick(glAccounts, n);
	const ccCandidates = costCenters.filter((c) => c.CompanyCode === company.CompanyCode);
	const skipCostCenter = gl.IsBalanceSheetAccount && n % 11 === 0;
	const costCenter = skipCostCenter ? null : pick(ccCandidates, Math.floor(n / 3));
	const profitCenter = profitCenters.find((p) => p.CompanyCode === company.CompanyCode);
	const isCredit = gl.GLAccount.startsWith("4") || gl.GLAccount === "160000" || gl.GLAccount === "211000" || gl.GLAccount === "110000" && n % 3 === 0;
	const debitCredit = isCredit ? "H" : "S";
	const base = [250, 480, 890.5, 1250, 3480, 5600, 8900, 12500, 22000][n % 9];
	let amount = Number((base * (1 + (n % 7) * 0.15)).toFixed(3));
	if (n === 17 || n === 103 || n === 301) {
		amount = Number((1250000 + n * 100).toFixed(3));
	}
	if (debitCredit === "H") {
		amount = -amount;
	}
	const gbp = Number((amount * toGbp[company.Currency]).toFixed(3));
	const obsolete = n % 37 === 0 ? "W" : "";
	const ledger = n % 15 === 0 ? "2L" : "0L";
	const ledgerName = ledger === "0L" ? "Leading ledger" : "Local GAAP ledger";
	const doc = 1900000000 + Math.floor(n / 2);
	const itemNo = pad((n % 2) + 1, 3);
	const id = company.CompanyCode + year + String(doc) + itemNo + pad(seq++, 4);

	items.push({
		ID: id,
		Ledger: ledger,
		LedgerName: ledgerName,
		SourceLedger: ledger,
		LedgerFiscalYear: String(year),
		ControllingArea: "A000",
		ControllingAreaName: "MindTek Group",
		CompanyCode: company.CompanyCode,
		CompanyCodeName: company.CompanyCodeName,
		GLAccount: gl.GLAccount,
		GLAccountName: gl.GLAccountName,
		FinancialTransactionType: "RFBU",
		BusinessTransactionCategory: "RFBU",
		BusinessTransactionType: "RFBU",
		SourceReferenceDocumentType: "BKPF",
		JrnlEntryItemObsoleteReason: obsolete || null,
		CostCenter: costCenter ? costCenter.CostCenter : null,
		CostCenterName: costCenter ? costCenter.CostCenterName : null,
		ProfitCenter: profitCenter.ProfitCenter,
		ProfitCenterName: profitCenter.ProfitCenterName,
		FunctionalArea: gl.IsProfitLossAccount ? "YB40" : null,
		FunctionalAreaName: gl.IsProfitLossAccount ? "Services" : null,
		BusinessArea: null,
		BusinessAreaName: null,
		Segment: company.CompanyCode,
		SegmentName: company.CompanyCodeName,
		PartnerCostCenter: null,
		PartnerCostCenterName: null,
		PartnerProfitCenter: null,
		PartnerProfitCenterName: null,
		PartnerFunctionalArea: null,
		PartnerFunctionalAreaName: null,
		PartnerBusinessArea: null,
		PartnerBusinessAreaName: null,
		PartnerCompany: null,
		PartnerCompanyName: null,
		PartnerSegment: null,
		PartnerSegmentName: null,
		TransactionCurrency: company.Currency,
		AmountInTransactionCurrency: amount.toFixed(3),
		CompanyCodeCurrency: company.Currency,
		AmountInCompanyCodeCurrency: amount.toFixed(3),
		GlobalCurrency: "GBP",
		AmountInGlobalCurrency: gbp.toFixed(3),
		FixedAmountInGlobalCrcy: gbp.toFixed(3),
		FunctionalCurrency: "GBP",
		AmountInFunctionalCurrency: gbp.toFixed(3),
		ControllingObjectCurrency: company.Currency,
		AmountInObjectCurrency: amount.toFixed(3),
		CostSourceUnit: null,
		ValuationQuantity: null,
		ValuationFixedQuantity: null,
		ReferenceQuantityUnit: null,
		ReferenceQuantity: null,
		FreeDefinedCurrency1: null,
		AmountInFreeDefinedCurrency1: null,
		FreeDefinedCurrency2: null,
		AmountInFreeDefinedCurrency2: null,
		FreeDefinedCurrency3: null,
		AmountInFreeDefinedCurrency3: null,
		FreeDefinedCurrency4: null,
		AmountInFreeDefinedCurrency4: null,
		FreeDefinedCurrency5: null,
		AmountInFreeDefinedCurrency5: null,
		FreeDefinedCurrency6: null,
		AmountInFreeDefinedCurrency6: null,
		FreeDefinedCurrency7: null,
		AmountInFreeDefinedCurrency7: null,
		FreeDefinedCurrency8: null,
		AmountInFreeDefinedCurrency8: null,
		BaseUnit: null,
		Quantity: null,
		AdditionalQuantity1Unit: null,
		AdditionalQuantity1: null,
		AdditionalQuantity2Unit: null,
		AdditionalQuantity2: null,
		AdditionalQuantity3Unit: null,
		AdditionalQuantity3: null,
		AccountingDocumentCategory: obsolete ? "V" : "",
		FiscalPeriod: pad(period, 3),
		FiscalYearVariant: "K4",
		FiscalYearPeriod: String(year) + pad(period, 3),
		ChartOfAccounts: "YCOA",
		Plant: null,
		PlantName: null,
		Customer: null,
		CustomerName: null,
		ControllingDebitCreditCode: debitCredit,
		ProjectExternalID: null,
		Project: null,
		ProjectDescription: null,
		WBSElementExternalID: null,
		WBSElement: null,
		WBSElementDescription: null,
		PartnerCompanyCode: null,
		PartnerCompanyCodeName: null,
		CostCtrActivityType: null,
		CostCtrActivityTypeName: null,
		OrderID: null,
		PartnerOrder: null,
		PartnerCostCtrActivityType: null,
		PartnerCostCtrActivityTypeName: null,
		PartnerProject: null,
		PartnerProjectDescription: null,
		PartnerWBSElement: null,
		PartnerWBSElementDescription: null,
		SalesOrganization: null,
		SalesOrganizationName: null,
		DistributionChannel: null,
		DistributionChannelName: null,
		OrganizationDivision: null,
		DivisionName: null,
		Product: null,
		ProductName: null,
		SoldMaterial: null,
		SoldMaterialName: null,
		MaterialGroup: null,
		MaterialGroupName: null,
		CustomerGroup: null,
		CustomerGroupName: null,
		CustomerSupplierCountry: company.Country,
		CustomerSupplierCountryName: company.Country === "GB" ? "United Kingdom" : company.Country === "BR" ? "Brazil" : company.Country === "DE" ? "Germany" : "United States",
		CustomerSupplierIndustry: null,
		CustomerSupplierIndustryName: null,
		SalesDistrict: null,
		SalesDistrictName: null,
		FinancialManagementArea: "A000",
		Fund: null,
		GrantID: null,
		BudgetPeriod: null,
		SponsoredProgram: null,
		SponsoredClass: null,
		GteeMBudgetValidityNumber: null,
		JointVenture: null,
		JointVentureEquityGroup: null,
		JointVentureCostRecoveryCode: null,
		JointVentureProductionDate: null,
		REBusinessEntity: null,
		RealEstateBuilding: null,
		RealEstateProperty: null,
		RERentalObject: null,
		RealEstateContract: null,
		REServiceChargeKey: null,
		RESettlementUnitID: null,
		SettlementReferenceDate: null
	});
}

function write(name, data) {
	fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
	console.log(name, data.length);
}

write("A_CompanyCode.json", companyCodesJson);
write("A_CostCenter.json", costCentersJson);
write("A_ProfitCenter.json", profitCentersJson);
write("A_GLAccountInChartOfAccounts.json", glJson);
write("A_JournalEntryItemBasic.json", items);
