<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class user_website
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
    private $website_type;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $website_link;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersWebsites")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $websitesUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getWebsite_type() {
		return $this->website_type;
	}

	public function setWebsite_type($website_type) {
		$this->website_type = $website_type;
	}

	public function getWebsite_link() {
		return $this->website_link;
	}

	public function setWebsite_link($website_link) {
		$this->website_link = $website_link;
	}

	public function getWebsitesUser() {
		return $this->websitesUser;
	}

	public function setWebsitesUser($websitesUser) {
		$this->websitesUser = $websitesUser;
	}

}