<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class share
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="wall_postsShare")
     * @ORM\JoinColumn(name="wall_post_id", referencedColumnName="id")
     */
    private $sharesWall_post;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="shared_byShares")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $sharesShared_by;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_photo", inversedBy="socialise_photosShare")
     * @ORM\JoinColumn(name="socialise_photo_id", referencedColumnName="id")
     */
    private $sharesSocialise_photo;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\blogs", inversedBy="shares")
     * @ORM\JoinColumn(name="blogs_id", referencedColumnName="id")
     */
    private $blogs;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_album", inversedBy="share")
     * @ORM\JoinColumn(name="socialise_album_id", referencedColumnName="id")
     */
    private $socialiseAlbum;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\photo_group", inversedBy="share")
     * @ORM\JoinColumn(name="photo_group_id", referencedColumnName="id")
     */
    private $photoGroup;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getSharesWall_post() {
		return $this->sharesWall_post;
	}

	public function setSharesWall_post($sharesWall_post) {
		$this->sharesWall_post = $sharesWall_post;
	}

	public function getSharesShared_by() {
		return $this->sharesShared_by;
	}

	public function setSharesShared_by($sharesShared_by) {
		$this->sharesShared_by = $sharesShared_by;
	}

	public function getSharesSocialise_photo() {
		return $this->sharesSocialise_photo;
	}

	public function setSharesSocialise_photo($sharesSocialise_photo) {
		$this->sharesSocialise_photo = $sharesSocialise_photo;
	}

	public function getBlogs() {
		return $this->blogs;
	}

	public function setBlogs($blogs) {
		$this->blogs = $blogs;
	}

	public function getSocialiseAlbum() {
		return $this->socialiseAlbum;
	}

	public function setSocialiseAlbum($socialiseAlbum) {
		$this->socialiseAlbum = $socialiseAlbum;
	}

	public function getPhotoGroup() {
		return $this->photoGroup;
	}

	public function setPhotoGroup($photoGroup) {
		$this->photoGroup = $photoGroup;
	}

}