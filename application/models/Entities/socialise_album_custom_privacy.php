<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class socialise_album_custom_privacy
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    private $album_owner_id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\socialise_album", inversedBy="socialiseAlbumCustomPrivacy")
     * @ORM\JoinColumn(name="socialise_album_id", referencedColumnName="id", nullable=false)
     */
    private $socialiseAlbum;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="socialiseAlbumCustomPrivacy")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id")
     */
    private $ilookUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getAlbum_owner_id() {
		return $this->album_owner_id;
	}

	public function setAlbum_owner_id($album_owner_id) {
		$this->album_owner_id = $album_owner_id;
	}

	public function getSocialiseAlbum() {
		return $this->socialiseAlbum;
	}

	public function setSocialiseAlbum($socialiseAlbum) {
		$this->socialiseAlbum = $socialiseAlbum;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}