import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsettingcardComponent } from './editsettingcard.component';

describe('EditsettingcardComponent', () => {
  let component: EditsettingcardComponent;
  let fixture: ComponentFixture<EditsettingcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditsettingcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditsettingcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
