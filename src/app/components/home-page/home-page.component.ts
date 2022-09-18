import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { GiphyService, objectQuery } from 'src/app/services/giphy.service';
import { Observable, of, Subject } from 'rxjs';
import {
  map,
  tap,
  debounceTime,
  takeUntil,
  switchMap,
  finalize,
} from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  gifs: any[] = [];
  searchForm!: FormGroup;
  unsubscribe$ = new Subject();
  loading = false;
  constructor(private giphyService: GiphyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.initForm();
    this.getTrendingGifs();
    this.searchGifs();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(false);
  }

  initForm() {
    return this.fb.group({
      query: '',
    });
  }

  getTrendingGifs(objQuery?: objectQuery) {
    this.giphyService
      .getTrendingGifs(objQuery)
      .pipe(
        tap(() => (this.loading = true)),
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (val: any) => {
          this.gifs = this.gifs.concat(val.data);
        },
        (err) => alert('Something went wrong')
      );
  }

  searchGifs() {
    this.searchForm.controls['query'].valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((query) =>
          query
            ? this.giphyService.searchGifs(query)
            : this.giphyService.getTrendingGifs()
        ),
        tap(() => (this.loading = true)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (gifs) => {
          this.loading = false;
          this.gifs = gifs.data;
        },
        (err) => alert('Something went wrong')
      );
  }

  getDocHeight() {
    var D = document;
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
  }

  // @HostListener('scroll', ['$event']) // for scroll events of the current element
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    const scrollingElement = event.target?.scrollingElement;

    if (scrollingElement) {
      const documentHeight = this.getDocHeight();
      const { scrollTop, clientHeight } = scrollingElement;
      if (
        Math.ceil(scrollTop + clientHeight) >= documentHeight &&
        !this.searchForm.controls['query'].value
      ) {
        this.getTrendingGifs({ offset: this.gifs.length });
      }
    }
  }
}
