import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
    describe("Given all fields are filled correctly and I click on submit button", () => {
      test("Then A new bill should be created and Bills page should be rendered", () => {
        const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: null, bills, localStorage: window.localStorage
      }) 
        const expenseTypeInput = screen.getByTestId('expense-type');
        fireEvent.change(expenseTypeInput, {target: { value: 'Transports'}});
        expect(expenseTypeInput.value).toBe('Transports')

        const expenseNameInput = screen.getByTestId('expense-name');
        fireEvent.change(expenseNameInput, {target: { value: 'Vol Marseille'}});
        expect(expenseNameInput.value).toBe('Vol Marseille')

        const expenseDateInput = screen.getByTestId('expense-name');
        fireEvent.change(expenseDateInput, {target: { value: '03/01/2022'}});
        expect(expenseDateInput.value).toBe('03/01/2022')

        const amountInput = screen.getByTestId('amount');
        fireEvent.change(amountInput, {target: { value: '300'}});
        expect(amountInput.value).toBe('300')

        const vatInput = screen.getByTestId('vat');
        fireEvent.change(vatInput, {target: { value: '70'}});
        expect(vatInput.value).toBe('70')

        const pctInput = screen.getByTestId('pct');
        fireEvent.change(pctInput, {target: { value: '20'}});
        expect(pctInput.value).toBe('20')

        const handleSubmit  = jest.fn(newBill.handleSubmit)


      })
    })
  })
})