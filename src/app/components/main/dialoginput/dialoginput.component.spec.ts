import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoginputComponent } from './dialoginput.component';

describe('DialoginputComponent', () => {
  let component: DialoginputComponent;
  let fixture: ComponentFixture<DialoginputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialoginputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialoginputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
