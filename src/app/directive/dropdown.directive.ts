import {Directive, ElementRef, HostBinding, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @Input('appDropdown')
  dropdownContent!: ElementRef;

  isHide = true;

  constructor(private render: Renderer2) { }

  @HostListener('mouseover') show() {
    console.log('hover');
    console.log(this.dropdownContent.nativeElement);
    this.render.removeClass(this.dropdownContent, 'hide');
    // this.render.setStyle(this.dropdownContent.nativeElement, 'display', 'block');
  }
  @HostListener('mouseleave') hide() {
    this.render.addClass(this.dropdownContent, 'hide');
  }


}
