<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class likes
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $is_liked;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="wall_postsLikes")
     * @ORM\JoinColumn(name="wall_post_id", referencedColumnName="id")
     */
    private $likesWall_post;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="liked_byLikes")
     * @ORM\JoinColumn(name="liked_by_user_id", referencedColumnName="id", nullable=false)
     */
    private $likesLiked_by;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_album", inversedBy="socialise_albumsLike")
     * @ORM\JoinColumn(name="socialise_album_id", referencedColumnName="id")
     */
    private $likesSocialise_album;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_photo", inversedBy="socialise_photosLike")
     * @ORM\JoinColumn(name="socialise_photo_id", referencedColumnName="id")
     */
    private $likesSocialise_photo;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\blogs", inversedBy="likeses")
     * @ORM\JoinColumn(name="blogs_id", referencedColumnName="id")
     */
    private $blogs;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\photo_group", inversedBy="likes")
     * @ORM\JoinColumn(name="photo_group_id", referencedColumnName="id")
     */
    private $photoGroup;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getIs_liked() {
		return $this->is_liked;
	}

	public function setIs_liked($is_liked) {
		$this->is_liked = $is_liked;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getLikesWall_post() {
		return $this->likesWall_post;
	}

	public function setLikesWall_post($likesWall_post) {
		$this->likesWall_post = $likesWall_post;
	}

	public function getLikesLiked_by() {
		return $this->likesLiked_by;
	}

	public function setLikesLiked_by($likesLiked_by) {
		$this->likesLiked_by = $likesLiked_by;
	}

	public function getLikesSocialise_album() {
		return $this->likesSocialise_album;
	}

	public function setLikesSocialise_album($likesSocialise_album) {
		$this->likesSocialise_album = $likesSocialise_album;
	}

	public function getLikesSocialise_photo() {
		return $this->likesSocialise_photo;
	}

	public function setLikesSocialise_photo($likesSocialise_photo) {
		$this->likesSocialise_photo = $likesSocialise_photo;
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

}