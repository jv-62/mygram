import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  exist: string | null;

  constructor(
    private _router: Router,
    @Inject(DOCUMENT) private _document: Document
  ) {
    const sessionData = JSON.parse(sessionStorage.getItem('Users'));
    this.exist = sessionData;
  }
  ngOnInit(): void { }

  logout() {
    sessionStorage.clear();
    this._router.navigate(['/signin']);
    this._document.defaultView.location.reload();
  }
}
