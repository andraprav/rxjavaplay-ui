import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../shared/post.model';
import {Observable} from 'rxjs';
import {PostService} from '../shared/post.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  q = null;
  posts: Observable<Post[]>;

  constructor(protected router: Router,
              protected postService: PostService,
              protected cd: ChangeDetectorRef) {
  }

  search() {
    this.posts = this.postService.getPostsStream(this.cd);
  }

  addPost() {
    this.router.navigate(['', 'post', 'new']);
  }

  ngOnInit() {
    console.log('calling ngOnInit::PostListComponent');
    this.search();
  }

  ngOnDestroy() {
    console.log('calling ngOnDestroy::PostListComponent');
  }

}
