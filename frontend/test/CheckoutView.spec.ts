import { mount } from "@vue/test-utils";
import CheckoutViewVue from '../src/views/CheckoutView.vue';

it('Deve testar a tela do checkout', () => {
    const wrapper = mount(CheckoutViewVue, {});
    expect(wrapper.get('.title-name').text()).toBe('Checkout');
});