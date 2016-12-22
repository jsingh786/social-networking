<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class wall_post
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=2, nullable=true)
     */
    private $post_update_type;

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    private $wall_post_text;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $wall_post_text_when_shared;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $visibility_criteria;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $comment_count;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $like_count;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $post_type;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $group_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $job_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $company_id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $wall_type;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $share_count;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $link_data;

    /**
     * @ORM\OneToOne(targetEntity="Entities\photo_group", inversedBy="wallPost", cascade={"remove"})
     * @ORM\JoinColumn(name="photo_group_id", referencedColumnName="id", unique=true)
     */
    private $photoGroup;

    /**
     * @ORM\OneToOne(targetEntity="Entities\socialise_photo", inversedBy="wallPost", cascade={"remove"})
     * @ORM\JoinColumn(name="socialise_photo_id", referencedColumnName="id", unique=true)
     */
    private $socialisePhoto;

    /**
     * @ORM\OneToMany(targetEntity="Entities\likes", mappedBy="likesWall_post", cascade={"remove"})
     */
    private $wall_postsLikes;

    /**
     * @ORM\OneToMany(targetEntity="Entities\share", mappedBy="sharesWall_post", cascade={"remove"})
     */
    private $wall_postsShare;

    /**
     * @ORM\OneToMany(targetEntity="Entities\comments", mappedBy="commentsWall_post", cascade={"remove"})
     */
    private $wall_postsComment;

    /**
     * @ORM\OneToMany(targetEntity="Entities\wishes", mappedBy="wallPost")
     *
     */
    private $wishes;

    /**
     * @ORM\OneToMany(targetEntity="Entities\report_abuse", mappedBy="wallPost", cascade={"remove"})
     */
    private $reportAbusePost;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\link_requests", inversedBy="link_requestsWall_post")
     * @ORM\JoinColumn(name="link_requests_id", referencedColumnName="id")
     */
    private $wall_postsLink_request;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_album", inversedBy="socialise_albumsWall_post")
     * @ORM\JoinColumn(name="socialise_album_id", referencedColumnName="id")
     */
    private $wall_postsSocialise_album;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="original_usersWall_post")
	 * @ORM\JoinColumn(name="original_user_id", referencedColumnName="id", nullable=false)
	 */
	private $wall_postsOriginal_user;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="from_usersWall_post")
	 * @ORM\JoinColumn(name="from_user_id", referencedColumnName="id")
	 */
	private $wall_postsFrom_user;
	
    /**
     * @ORM\OneToMany(targetEntity="Entities\posted_to", mappedBy="wallPost", cascade={"remove"})
     */
    private $postedTo;

    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @var datetime $last_activity_datetime
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $last_activity_datetime;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\post_tags", inversedBy="wallPost")
     * @ORM\JoinColumn(name="tag_id", referencedColumnName="id")
     */

    private $postTags;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="shared_wallpost")
     * @ORM\JoinColumn(name="wall_post_id", referencedColumnName="id")
     */
    private $shared_from_wallpost;

 	/**
     * @ORM\OneToMany(targetEntity="Entities\wall_post", mappedBy="shared_from_wallpost", cascade={"remove"})
     */
    private $shared_wallpost;

	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getPost_update_type() {
		return $this->post_update_type;
	}

	public function setPost_update_type($post_update_type) {
		$this->post_update_type = $post_update_type;
	}

	public function getWall_post_text() {
		return $this->wall_post_text;
	}

	public function setWall_post_text($wall_post_text) {
		$this->wall_post_text = $wall_post_text;
	}

	public function getWall_post_text_when_shared() {
		return $this->wall_post_text_when_shared;
	}

	public function setWall_post_text_when_shared($wall_post_text_when_shared) {
		$this->wall_post_text_when_shared = $wall_post_text_when_shared;
	}

	public function getVisibility_criteria() {
		return $this->visibility_criteria;
	}

	public function setVisibility_criteria($visibility_criteria) {
		$this->visibility_criteria = $visibility_criteria;
	}

	public function getComment_count() {
		return $this->comment_count;
	}

	public function setComment_count($comment_count) {
		$this->comment_count = $comment_count;
	}

	public function getLike_count() {
		return $this->like_count;
	}

	public function setLike_count($like_count) {
		$this->like_count = $like_count;
	}

	public function getPost_type() {
		return $this->post_type;
	}

	public function setPost_type($post_type) {
		$this->post_type = $post_type;
	}

	public function getGroup_id() {
		return $this->group_id;
	}

	public function setGroup_id($group_id) {
		$this->group_id = $group_id;
	}

	public function getJob_id() {
		return $this->job_id;
	}

	public function setJob_id($job_id) {
		$this->job_id = $job_id;
	}

	public function getCompany_id() {
		return $this->company_id;
	}

	public function setCompany_id($company_id) {
		$this->company_id = $company_id;
	}

	public function getWall_type() {
		return $this->wall_type;
	}

	public function setWall_type($wall_type) {
		$this->wall_type = $wall_type;
	}

	public function getShare_count() {
		return $this->share_count;
	}

	public function setShare_count($share_count) {
		$this->share_count = $share_count;
	}

	public function getLink_data() {
		return $this->link_data;
	}

	public function setLink_data($link_data) {
		$this->link_data = $link_data;
	}

	public function getPhotoGroup() {
		return $this->photoGroup;
	}

	public function setPhotoGroup($photoGroup) {
		$this->photoGroup = $photoGroup;
	}

	public function getSocialisePhoto() {
		return $this->socialisePhoto;
	}

	public function setSocialisePhoto($socialisePhoto) {
		$this->socialisePhoto = $socialisePhoto;
	}

	public function getWall_postsLikes() {
		return $this->wall_postsLikes;
	}

	public function setWall_postsLikes($wall_postsLikes) {
		$this->wall_postsLikes = $wall_postsLikes;
	}

	public function getWall_postsShare() {
		return $this->wall_postsShare;
	}

	public function setWall_postsShare($wall_postsShare) {
		$this->wall_postsShare = $wall_postsShare;
	}

	public function getWall_postsComment() {
		return $this->wall_postsComment;
	}

	public function setWall_postsComment($wall_postsComment) {
		$this->wall_postsComment = $wall_postsComment;
	}
	public function getShared_from_wallpost() {
		return $this->shared_from_wallpost;
	}

	public function setShared_from_wallpost($shared_from_wallpost) {
		$this->shared_from_wallpost = $shared_from_wallpost;
	}

	public function getWishes() {
		return $this->wishes;
	}

	public function setWishes($wishes) {
		$this->wishes = $wishes;
	}

	public function getReportAbusePost() {
		return $this->reportAbusePost;
	}

	public function setReportAbusePost($reportAbusePost) {
		$this->reportAbusePost = $reportAbusePost;
	}

	public function getWall_postsLink_request() {
		return $this->wall_postsLink_request;
	}

	public function setWall_postsLink_request($wall_postsLink_request) {
		$this->wall_postsLink_request = $wall_postsLink_request;
	}

	public function getWall_postsSocialise_album() {
		return $this->wall_postsSocialise_album;
	}

	public function setWall_postsSocialise_album($wall_postsSocialise_album) {
		$this->wall_postsSocialise_album = $wall_postsSocialise_album;
	}

	public function getWall_postsFrom_user() {
		return $this->wall_postsFrom_user;
	}

	public function setWall_postsFrom_user($wall_postsFrom_user) {
		$this->wall_postsFrom_user = $wall_postsFrom_user;
	}

	public function getWall_postsOriginal_user() {
		return $this->wall_postsOriginal_user;
	}

	public function setWall_postsOriginal_user($wall_postsOriginal_user) {
		$this->wall_postsOriginal_user = $wall_postsOriginal_user;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

	public function getLast_activity_datetime() {
		return $this->last_activity_datetime;
	}

	public function setLast_activity_datetime($last_activity_datetime) {
		$this->last_activity_datetime = $last_activity_datetime;
	}
	public function getPostedTo() {
		return $this->postedTo;
	}

	public function setPostedTo($postedTo) {
		$this->postedTo = $postedTo;
	}
	public function getPostTags() {
		return $this->postTags;
	}

	public function setPostTags($postTags) {
		$this->postTags = $postTags;
	}
	public function getShared_wallpost() {
		return $this->shared_wallpost;
	}

	public function setShared_wallpost($shared_wallpost) {
		$this->shared_wallpost = $shared_wallpost;
	}



}