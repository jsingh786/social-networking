<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class comments
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $comment_text;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $same_comment_id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $type;

    /**
     * @ORM\OneToMany(targetEntity="Entities\users_comments_visibility", mappedBy="comments", cascade={"remove"})
     */
    private $users_comments_visibilities;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="wall_postsComment")
     * @ORM\JoinColumn(name="wall_post_id", referencedColumnName="id")
     */
    private $commentsWall_post;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="ilook_usersComment")
     * @ORM\JoinColumn(name="comment_by_user_id", referencedColumnName="id", nullable=false)
     */
    private $commentsIlook_user;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_photo", inversedBy="socialise_photosComment")
     * @ORM\JoinColumn(name="socialise_photo_id", referencedColumnName="id")
     */
    private $commentsSocialise_photo;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_album", inversedBy="socialise_albumsComment")
     * @ORM\JoinColumn(name="socialise_album_id", referencedColumnName="id")
     */
    private $commentsSocialise_album;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\blogs", inversedBy="commentses")
     * @ORM\JoinColumn(name="blogs_id", referencedColumnName="id")
     */
    private $blogs;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\photo_group", inversedBy="comments")
     * @ORM\JoinColumn(name="photo_group_id", referencedColumnName="id")
     */
    private $photoGroup;
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getComment_text() {
		return $this->comment_text;
	}

	public function setComment_text($comment_text) {
		$this->comment_text = $comment_text;
	}

	public function getSame_comment_id() {
		return $this->same_comment_id;
	}

	public function setSame_comment_id($same_comment_id) {
		$this->same_comment_id = $same_comment_id;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getUsers_comments_visibilities() {
		return $this->users_comments_visibilities;
	}

	public function setUsers_comments_visibilities($users_comments_visibilities) {
		$this->users_comments_visibilities = $users_comments_visibilities;
	}

	public function getCommentsWall_post() {
		return $this->commentsWall_post;
	}

	public function setCommentsWall_post($commentsWall_post) {
		$this->commentsWall_post = $commentsWall_post;
	}

	public function getCommentsIlook_user() {
		return $this->commentsIlook_user;
	}

	public function setCommentsIlook_user($commentsIlook_user) {
		$this->commentsIlook_user = $commentsIlook_user;
	}

	public function getCommentsSocialise_photo() {
		return $this->commentsSocialise_photo;
	}

	public function setCommentsSocialise_photo($commentsSocialise_photo) {
		$this->commentsSocialise_photo = $commentsSocialise_photo;
	}

	public function getCommentsSocialise_album() {
		return $this->commentsSocialise_album;
	}

	public function setCommentsSocialise_album($commentsSocialise_album) {
		$this->commentsSocialise_album = $commentsSocialise_album;
	}

	public function getBlogs() {
		return $this->blogs;
	}

	public function setBlogs($blogs) {
		$this->blogs = $blogs;
	}

	public function getPhotoGroup() {
		return $this->photoGroup;
	}

	public function setPhotoGroup($photoGroup) {
		$this->photoGroup = $photoGroup;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

}