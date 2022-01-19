/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const bill = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(bill.handleClickIconEye)
      const eyes = screen.getAllByTestId('icon-eye')
      eyes.forEach((eye) => {
        eye.addEventListener('click', handleClickIconEye)
        userEvent.click(eye)
      })
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})