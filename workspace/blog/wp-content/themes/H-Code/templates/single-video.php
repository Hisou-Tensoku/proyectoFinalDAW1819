<div class="blog-date no-padding-top"><?php _e('Posted by ', langdomain()); ?><a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"><?php the_author(); ?></a> | <?php echo get_the_date( get_option('date_format') ); ?> | <?php echo get_num_visits(get_the_ID()); ?></div>

<h2 class="blog-details-headline text-black fit-videos"><?php echo the_title(); ?></h2>
 <!-- end post title  -->
 <!-- post date and categories  -->
<!-- end date and categories   -->
<!-- post title  -->
<div class="fit-videos">
    <?php the_content(); ?>
</div>
<!-- post details text -->
<div class="blog-details-text">
<div class="row blog-date no-padding-top margin-eight no-margin-bottom">
<!-- post tags -->
<div class="col-md-6">
<h5 class="widget-title margin-one no-margin-top"><?php _e('Category', langdomain()); ?></h5>
<?php the_category(', '); ?>
</div>
<div class="col-md-6">
<h5 class="widget-title margin-one no-margin-top"><?php _e('Tags', langdomain()); ?></h5>
<?php the_tags('', ', ', ''); ?>
</div>

</div>
<!-- end post tags -->
</div>