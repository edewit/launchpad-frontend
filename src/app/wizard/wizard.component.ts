import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ForgeService } from '../shared/forge.service'
import { History, Gui, Input, Message, Result } from '../shared/model';

import 'rxjs/add/operator/debounceTime';
import * as jsonpatch from 'fast-json-patch';

@Component({
  selector: 'wizard',
  templateUrl: './wizard.component.html',
  styles: [`
    .required > label:after {
      content: ' *'
    }
    .ng-invalid {
      border-color: #c00;
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    }
    .ng-invalid + div.errorLabel {
      color: red;
      display: block;
    }
    .ng-valid + div.errorLabel {
      display: none;
    }
  `]
})
export class FormComponent implements OnInit {
  @ViewChild('wizard') form: NgForm;
  command: string;
  isValidating: boolean;
  history: History = new History();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private forgeService: ForgeService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let state = params['state'];
      this.command = params['command'];
      let stepIndex = +params['step'];
      if (params['step'] == 'end') {
        let currentGui = new Gui();
        currentGui.inputs = [];
        currentGui.results = [];
        this.history.add(currentGui);
        return;
      }

      if (!this.history.get(stepIndex)) {
        if (stepIndex == 0) {
          this.forgeService.commandInfo(this.command).then((gui) => {
            this.history.add(gui);
          }).catch(error => this.currentGui.messages.push(new Message(error)));
        } else {
          this.forgeService.nextStep(this.command, this.history).then(gui => {
            if (gui.messages && gui.messages.length > 0) {
              this.router.navigate(["../" + --stepIndex], { relativeTo: this.route });
            }
            this.history.add(gui);
          }).catch(error => this.currentGui.messages.push(new Message(error)));
        }
      }
    });
  }

  get currentGui(): Gui {
    return this.history.currentGui();
  }

  validate(form: NgForm): Promise<Gui> {
    if (form.valid) {
      this.isValidating = true;
      return this.forgeService.validate(this.command, this.history).then(gui =>
      {
        var diff = jsonpatch.compare(this.currentGui, gui);
        var stepIndex = this.currentGui.stepIndex;
        jsonpatch.apply(this.currentGui, diff);
        this.history[stepIndex] = this.currentGui;
        this.currentGui.stepIndex = stepIndex;
        this.isValidating = false;
        return this.currentGui;
      }).catch(error => this.currentGui.messages.push(new Message(error)));
    }
    return Promise.resolve(this.currentGui);
  }

  messageForInput(name: string): Message {
    let result: Message;
    if (!this.currentGui.messages) return null;
    for (let message of this.currentGui.messages) {
      if (message.input == name) {
        result = message;
      }
    }
    return result;
  }

  next() {
    this.gotoStep(++this.currentGui.stepIndex);
  }

  gotoStep(step: number) {
    this.router.navigate(["../" + step], { relativeTo: this.route });
  }

  previous() {
    this.history.back();
    this.gotoStep(--this.currentGui.stepIndex);
  }

  restart() {
    this.router.navigate(["/"]);
  }

  finish() {
    this.router.navigate(["../end"], { relativeTo: this.route });
  }

  closeAlert(error: Message) {
    error.showError = true;
  }
}