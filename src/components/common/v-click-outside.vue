<script lang="ts">
import type { Directive, DirectiveBinding } from 'vue';

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: MouseEvent) => void;
}

const vClickOutside: Directive<ClickOutsideElement, (event: MouseEvent) => void> = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding<(event: MouseEvent) => void>) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent, true);
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent, true);
    }
  },
};

export default vClickOutside;
</script>
