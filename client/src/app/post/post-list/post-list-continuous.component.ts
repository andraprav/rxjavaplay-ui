import {Component} from '@angular/core';
import {PostListComponent} from './post-list.component';

@Component({
  selector: 'app-post-continuous-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListContinuousComponent extends PostListComponent {

  ngOnInit() {
    console.log('calling ngOnInit::PostListComponent');
    this.posts = this.postService.getPostsStream(this.cd, `${this.postService.apiUrl}/jokes`);
  }
}
