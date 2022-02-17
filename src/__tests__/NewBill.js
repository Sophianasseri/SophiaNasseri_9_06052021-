import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js"



jest.mock("../app/store", () => mockStore)



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("Given all fields are filled correctly and I click on submit button", () => {
      test("Then A new bill should be created and Bills page should be rendered", () => {
        const html = NewBillUI()
      document.body.innerHTML = html

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

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
      })
    })
    describe('Given I added an image file in the file input', () => {
      test('Then the file should have been changed in the file input', () =>{
        const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBill = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        })

        const fileInput = screen.getByTestId("file");
        const file = new File(["image.png"], "image.png", {type: "image/png"})
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        fileInput.addEventListener("change", handleChangeFile);
        userEvent.upload(fileInput, file)
        

        expect(handleChangeFile).toHaveBeenCalled()
        expect(screen.getByTestId("file").files[0].name).not.toBeNull()
        

      })
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I create a new bill", () => {
    test("Then it should add a bill to mock API POST", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill) 
      jest.spyOn(mockStore, "bills")
      const newBill = await mockStore.bills().update()
      expect(newBill.name).toMatch("encore")
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
  
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })

  })
})